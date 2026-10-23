import pptxgen from 'pptxgenjs';
import { getThemeById } from './themeService.js';

// Standard OpenXML shape identifiers in pptxgenjs
const ShapeType = {
  rect: 'rect',
  roundRect: 'roundRect'
};

export async function exportToPptx(project) {
  if (!project || !project.slides || project.slides.length === 0) {
    throw new Error('Project contains no slides to export.');
  }

  const theme = getThemeById(project.themeId);
  const rawColors = theme.pptx || {
    bg: '0F172A',
    cardBg: '1E293B',
    primary: '6366F1',
    secondary: '4338CA',
    accent: '38BDF8',
    textPrimary: 'FFFFFF',
    textSecondary: '94A3B8'
  };

  const colors = {
    bg: (rawColors.bg || '0F172A').replace(/#/g, ''),
    cardBg: (rawColors.cardBg || '1E293B').replace(/#/g, ''),
    primary: (rawColors.primary || '6366F1').replace(/#/g, ''),
    secondary: (rawColors.secondary || '4338CA').replace(/#/g, ''),
    accent: (rawColors.accent || '38BDF8').replace(/#/g, ''),
    textPrimary: (rawColors.textPrimary || 'FFFFFF').replace(/#/g, ''),
    textSecondary: (rawColors.textSecondary || '94A3B8').replace(/#/g, '')
  };

  const pptx = new pptxgen();
  // Standard PowerPoint 16:9 Widescreen (13.333 x 7.5 inches)
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'SlideGenius AI (Open Source)';
  pptx.company = 'SlideGenius Community';
  pptx.title = project.title;
  pptx.subject = project.topic || project.title;

  for (let i = 0; i < project.slides.length; i++) {
    const sData = project.slides[i];
    const slide = pptx.addSlide();

    // Background color (ensure clean 6-char hex without #)
    const bgColor = (colors.bg || '0F172A').replace('#', '');
    slide.background = { color: bgColor };

    // Full Slide Background Image if enabled
    if (sData.image && sData.imagePosition === 'background') {
      try {
        const imgProps = sData.image.startsWith('data:')
          ? { data: sData.image, x: 0, y: 0, w: '100%', h: '100%' }
          : { path: sData.image, x: 0, y: 0, w: '100%', h: '100%' };
        slide.addImage(imgProps);

        // Dark contrast overlay so text remains readable
        slide.addShape(ShapeType.rect, {
          x: 0,
          y: 0,
          w: '100%',
          h: '100%',
          fill: { color: '000000', transparency: 35 }
        });
      } catch (err) {
        console.warn('Could not embed slide background image:', err);
      }
    }

    // Add speaker notes
    if (sData.notes) {
      slide.addNotes(sData.notes);
    }

    // Top Accent line (across full 13.333" width)
    slide.addShape(ShapeType.rect, {
      x: 0,
      y: 0,
      w: '100%',
      h: 0.08,
      fill: { color: (colors.primary || '6366F1').replace('#', '') },
      line: { color: (colors.primary || '6366F1').replace('#', '') }
    });

    // Slide Number & Watermark-free footer (positioned comfortably inside 7.5" height)
    slide.addText(`Slide ${i + 1} of ${project.slides.length}`, {
      x: 0.8,
      y: 6.85,
      w: 4.0,
      h: 0.35,
      fontSize: 10,
      color: (colors.textSecondary || '94A3B8').replace('#', ''),
      fontFace: 'Arial'
    });

    slide.addText(`${project.title || ''}`, {
      x: 5.5,
      y: 6.85,
      w: 7.0,
      h: 0.35,
      fontSize: 10,
      align: 'right',
      color: (colors.textSecondary || '94A3B8').replace('#', ''),
      fontFace: 'Arial'
    });

    // Render by layout
    switch (sData.layout) {
      case 'title':
        renderTitleSlide(slide, sData, colors, pptx);
        break;
      case 'grid-3':
        renderGrid3Slide(slide, sData, colors, pptx);
        break;
      case 'metrics':
        renderMetricsSlide(slide, sData, colors, pptx);
        break;
      case 'two-column':
        renderTwoColumnSlide(slide, sData, colors, pptx);
        break;
      case 'thank-you':
        renderThankYouSlide(slide, sData, colors, pptx);
        break;
      case 'split-image':
      default:
        renderSplitImageSlide(slide, sData, colors, pptx);
        break;
    }
  }

  // Generate and download pptx file
  const filename = `${sanitizeFilename(project.title || 'presentation')}.pptx`;
  await pptx.writeFile({ fileName: filename });
}

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9-_\s]/g, '').trim().replace(/\s+/g, '_').slice(0, 40);
}

function renderTitleSlide(slide, sData, colors, pptx) {
  // Category Badge
  if (sData.badge) {
    slide.addShape(ShapeType.roundRect, {
      x: 1.0,
      y: 1.3,
      w: 2.2,
      h: 0.45,
      rectRadius: 0.1,
      fill: { color: colors.cardBg },
      line: { color: colors.primary, width: 1 }
    });
    slide.addText(sData.badge.toUpperCase(), {
      x: 1.0,
      y: 1.3,
      w: 2.2,
      h: 0.45,
      fontSize: 11,
      bold: true,
      color: colors.accent,
      align: 'center',
      fontFace: 'Arial'
    });
  }

  // Main Title
  slide.addText(sData.title, {
    x: 1.0,
    y: 2.0,
    w: 11.0,
    h: 1.5,
    fontSize: 40,
    bold: true,
    color: colors.textPrimary,
    fontFace: 'Arial'
  });

  // Subtitle
  if (sData.subtitle) {
    slide.addText(sData.subtitle, {
      x: 1.0,
      y: 3.5,
      w: 10.5,
      h: 1.0,
      fontSize: 18,
      color: colors.textSecondary,
      fontFace: 'Arial'
    });
  }

  // Bullet points
  if (sData.bullets && sData.bullets.length > 0) {
    const bulletItems = sData.bullets.map(b => ({
      text: b,
      options: { bullet: true, color: colors.textPrimary, fontSize: 14 }
    }));
    slide.addText(bulletItems, {
      x: 1.0,
      y: 4.6,
      w: 10.5,
      h: 1.8,
      fontFace: 'Arial'
    });
  }
}

function renderSplitImageSlide(slide, sData, colors, pptx) {
  // Title & Subtitle Header
  renderSlideHeader(slide, sData, colors);

  // Left side bullets
  if (sData.bullets && sData.bullets.length > 0) {
    const bulletItems = sData.bullets.map(b => ({
      text: b,
      options: { bullet: true, color: colors.textPrimary, fontSize: 15, breakLine: true }
    }));

    slide.addText(bulletItems, {
      x: 0.8,
      y: 2.3,
      w: 6.8,
      h: 4.2,
      fontFace: 'Arial'
    });
  }

  // Right side visual box or embedded image
  if (sData.image && sData.imagePosition !== 'background') {
    try {
      const imgProps = sData.image.startsWith('data:')
        ? { data: sData.image, x: 8.0, y: 2.2, w: 4.5, h: 4.2 }
        : { path: sData.image, x: 8.0, y: 2.2, w: 4.5, h: 4.2 };
      slide.addImage(imgProps);

      // Frame border around image
      slide.addShape(ShapeType.roundRect, {
        x: 8.0,
        y: 2.2,
        w: 4.5,
        h: 4.2,
        rectRadius: 0.12,
        fill: { type: 'none' },
        line: { color: colors.primary, width: 1.5 }
      });
    } catch (e) {
      // Fallback to stylized vector card
      renderFallbackCard(slide, sData, colors, pptx);
    }
  } else {
    renderFallbackCard(slide, sData, colors, pptx);
  }
}

function renderFallbackCard(slide, sData, colors, pptx) {
  slide.addShape(ShapeType.roundRect, {
    x: 8.0,
    y: 2.2,
    w: 4.5,
    h: 4.2,
    rectRadius: 0.15,
    fill: { color: colors.cardBg },
    line: { color: colors.primary, width: 1.5 }
  });

  slide.addText(sData.title, {
    x: 8.2,
    y: 3.5,
    w: 4.1,
    h: 1.0,
    fontSize: 18,
    bold: true,
    align: 'center',
    color: colors.accent,
    fontFace: 'Arial'
  });

  slide.addText('Key Takeaway & Architecture', {
    x: 8.2,
    y: 4.5,
    w: 4.1,
    h: 0.8,
    fontSize: 12,
    align: 'center',
    color: colors.textSecondary,
    fontFace: 'Arial'
  });
}

function renderGrid3Slide(slide, sData, colors, pptx) {
  renderSlideHeader(slide, sData, colors);

  const cards = sData.cards || [
    { title: 'Core Factor 1', desc: 'Detailed analysis of initial requirements and workflow.' },
    { title: 'Core Factor 2', desc: 'Iterative improvements and automated telemetry integration.' },
    { title: 'Core Factor 3', desc: 'Long-term stability and sustainable performance metrics.' }
  ];

  const startX = 0.8;
  const cardWidth = 3.6;
  const gap = 0.4;

  cards.slice(0, 3).forEach((card, idx) => {
    const x = startX + idx * (cardWidth + gap);

    // Card background
    slide.addShape(ShapeType.roundRect, {
      x,
      y: 2.4,
      w: cardWidth,
      h: 4.0,
      rectRadius: 0.12,
      fill: { color: colors.cardBg },
      line: { color: colors.primary, width: 1 }
    });

    // Card Tag/Badge
    slide.addText(card.tag || `Pillar ${idx + 1}`, {
      x: x + 0.3,
      y: 2.7,
      w: cardWidth - 0.6,
      h: 0.4,
      fontSize: 11,
      bold: true,
      color: colors.accent,
      fontFace: 'Arial'
    });

    // Card Title
    slide.addText(card.title || `Item ${idx + 1}`, {
      x: x + 0.3,
      y: 3.2,
      w: cardWidth - 0.6,
      h: 0.8,
      fontSize: 16,
      bold: true,
      color: colors.textPrimary,
      fontFace: 'Arial'
    });

    // Card Desc
    slide.addText(card.desc || '', {
      x: x + 0.3,
      y: 4.1,
      w: cardWidth - 0.6,
      h: 2.0,
      fontSize: 13,
      color: colors.textSecondary,
      fontFace: 'Arial'
    });
  });
}

function renderMetricsSlide(slide, sData, colors, pptx) {
  renderSlideHeader(slide, sData, colors);

  const metrics = sData.metrics || [
    { label: 'Growth', value: '+75%', subtext: 'Annual metric' },
    { label: 'Speed', value: '3.2x', subtext: 'Faster turnaround' },
    { label: 'Quality', value: '99.8%', subtext: 'Accuracy rate' }
  ];

  const count = Math.min(metrics.length, 4);
  const totalWidth = 11.6;
  const cardWidth = (totalWidth - (count - 1) * 0.4) / count;

  metrics.slice(0, 4).forEach((m, idx) => {
    const x = 0.8 + idx * (cardWidth + 0.4);

    slide.addShape(ShapeType.roundRect, {
      x,
      y: 2.5,
      w: cardWidth,
      h: 3.8,
      rectRadius: 0.15,
      fill: { color: colors.cardBg },
      line: { color: colors.primary, width: 1.5 }
    });

    slide.addText(m.value, {
      x: x + 0.2,
      y: 3.0,
      w: cardWidth - 0.4,
      h: 1.2,
      fontSize: 36,
      bold: true,
      align: 'center',
      color: colors.accent,
      fontFace: 'Arial'
    });

    slide.addText(m.label, {
      x: x + 0.2,
      y: 4.3,
      w: cardWidth - 0.4,
      h: 0.6,
      fontSize: 14,
      bold: true,
      align: 'center',
      color: colors.textPrimary,
      fontFace: 'Arial'
    });

    if (m.subtext) {
      slide.addText(m.subtext, {
        x: x + 0.2,
        y: 4.9,
        w: cardWidth - 0.4,
        h: 0.8,
        fontSize: 11,
        align: 'center',
        color: colors.textSecondary,
        fontFace: 'Arial'
      });
    }
  });
}

function renderTwoColumnSlide(slide, sData, colors, pptx) {
  renderSlideHeader(slide, sData, colors);

  const colWidth = 5.5;
  const y = 2.4;
  const h = 4.0;

  // Column 1 Box
  slide.addShape(ShapeType.roundRect, {
    x: 0.8,
    y,
    w: colWidth,
    h,
    rectRadius: 0.12,
    fill: { color: colors.cardBg },
    line: { color: colors.primary, width: 1 }
  });

  slide.addText(sData.col1Title || 'Key Challenges', {
    x: 1.1,
    y: 2.7,
    w: colWidth - 0.6,
    h: 0.5,
    fontSize: 18,
    bold: true,
    color: colors.accent,
    fontFace: 'Arial'
  });

  const col1Points = (sData.col1Points || []).map(p => ({
    text: p,
    options: { bullet: true, color: colors.textPrimary, fontSize: 13, breakLine: true }
  }));

  slide.addText(col1Points, {
    x: 1.1,
    y: 3.3,
    w: colWidth - 0.6,
    h: 2.8,
    fontFace: 'Arial'
  });

  // Column 2 Box
  slide.addShape(ShapeType.roundRect, {
    x: 6.9,
    y,
    w: colWidth,
    h,
    rectRadius: 0.12,
    fill: { color: colors.cardBg },
    line: { color: colors.accent, width: 1 }
  });

  slide.addText(sData.col2Title || 'Proposed Solutions', {
    x: 7.2,
    y: 2.7,
    w: colWidth - 0.6,
    h: 0.5,
    fontSize: 18,
    bold: true,
    color: colors.accent,
    fontFace: 'Arial'
  });

  const col2Points = (sData.col2Points || []).map(p => ({
    text: p,
    options: { bullet: true, color: colors.textPrimary, fontSize: 13, breakLine: true }
  }));

  slide.addText(col2Points, {
    x: 7.2,
    y: 3.3,
    w: colWidth - 0.6,
    h: 2.8,
    fontFace: 'Arial'
  });
}

function renderThankYouSlide(slide, sData, colors, pptx) {
  slide.addText(sData.title || 'Thank You', {
    x: 1.0,
    y: 2.2,
    w: 11.0,
    h: 1.5,
    fontSize: 44,
    bold: true,
    align: 'center',
    color: colors.accent,
    fontFace: 'Arial'
  });

  slide.addText(sData.subtitle || 'Questions & Discussion', {
    x: 1.0,
    y: 3.7,
    w: 11.0,
    h: 0.8,
    fontSize: 20,
    align: 'center',
    color: colors.textPrimary,
    fontFace: 'Arial'
  });

  if (sData.bullets && sData.bullets.length > 0) {
    const bullets = sData.bullets.map(b => ({
      text: b,
      options: { bullet: false, color: colors.textSecondary, fontSize: 14, align: 'center' }
    }));
    slide.addText(bullets, {
      x: 2.0,
      y: 4.8,
      w: 9.0,
      h: 1.5,
      fontFace: 'Arial'
    });
  }
}

function renderSlideHeader(slide, sData, colors) {
  if (sData.badge) {
    slide.addText(sData.badge.toUpperCase(), {
      x: 0.8,
      y: 0.6,
      w: 8.0,
      h: 0.3,
      fontSize: 10,
      bold: true,
      color: colors.accent,
      fontFace: 'Arial'
    });
  }

  slide.addText(sData.title, {
    x: 0.8,
    y: 0.9,
    w: 11.0,
    h: 0.7,
    fontSize: 26,
    bold: true,
    color: colors.textPrimary,
    fontFace: 'Arial'
  });

  if (sData.subtitle) {
    slide.addText(sData.subtitle, {
      x: 0.8,
      y: 1.6,
      w: 11.0,
      h: 0.5,
      fontSize: 13,
      color: colors.textSecondary,
      fontFace: 'Arial'
    });
  }
}
