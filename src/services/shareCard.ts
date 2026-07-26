import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

interface ShareCardInput {
  appName: string;
  title: string;
  subtitle: string;
  question?: string;
  labels: ShareCardLabels;
  cards: ShareCardItem[];
  summary: string;
  patterns: string[];
  guidance: string[];
  footer: string;
  fileName: string;
}

interface ShareCardLabels {
  overall: string;
  details: string;
  patterns: string;
  guidance: string;
  keywords: string;
}

interface ShareCardItem {
  name: string;
  secondaryName?: string;
  image: string;
  position: string;
  positionDescription?: string;
  keywords: string[];
  description: string;
  reversedLabel?: string;
}

export interface ShareGrid {
  columns: number;
  cardWidth: number;
  gapX: number;
  gapY: number;
}

export interface SharePlacement {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getShareGrid(cardCount: number): ShareGrid {
  if (cardCount <= 1) return { columns: 1, cardWidth: 280, gapX: 0, gapY: 0 };
  if (cardCount <= 3) return { columns: cardCount, cardWidth: 210, gapX: 42, gapY: 0 };
  if (cardCount <= 6) return { columns: 3, cardWidth: 160, gapX: 52, gapY: 74 };
  return { columns: 5, cardWidth: 130, gapX: 34, gapY: 68 };
}

export function getSharePlacements(cardCount: number): SharePlacement[] {
  const grid = getShareGrid(cardCount);
  const cardHeight = grid.cardWidth * 1.5;
  const labelHeight = cardCount <= 3 ? 72 : 58;
  const rowHeight = cardHeight + labelHeight + grid.gapY;
  return Array.from({ length: cardCount }, (_, index) => {
    const row = Math.floor(index / grid.columns);
    const firstInRow = row * grid.columns;
    const itemsInRow = Math.min(grid.columns, cardCount - firstInRow);
    const rowWidth = itemsInRow * grid.cardWidth + (itemsInRow - 1) * grid.gapX;
    const column = index - firstInRow;
    return {
      x: (1080 - rowWidth) / 2 + column * (grid.cardWidth + grid.gapX),
      y: 310 + row * rowHeight,
      width: grid.cardWidth,
      height: cardHeight,
    };
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const chars = [...text];
  const lines: string[] = [];
  let line = '';
  for (const char of chars) {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line.trim());
      line = char;
    } else line = test;
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

function drawImageContained(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  ctx.fillStyle = '#07111f';
  ctx.fillRect(x, y, width, height);
  ctx.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let value = text;
  while (value.length > 1 && ctx.measureText(`${value}…`).width > maxWidth) value = value.slice(0, -1);
  return `${value}…`;
}

function drawLines(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number,
) {
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
}

function drawSectionHeading(ctx: CanvasRenderingContext2D, label: string, y: number) {
  ctx.textAlign = 'left';
  ctx.fillStyle = '#c8a97e';
  ctx.font = '600 34px Georgia, serif';
  ctx.fillText(label, 90, y);
  ctx.strokeStyle = 'rgba(200,169,126,.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(90, y + 20);
  ctx.lineTo(990, y + 20);
  ctx.stroke();
}

async function renderShareCard(input: ShareCardInput) {
  const images = await Promise.all(input.cards.map(card => loadImage(card.image)));
  const measureCanvas = document.createElement('canvas');
  measureCanvas.width = 1080;
  measureCanvas.height = 1;
  const measure = measureCanvas.getContext('2d');
  if (!measure) throw new Error('Canvas is unavailable');

  const grid = getShareGrid(input.cards.length);
  const placements = getSharePlacements(input.cards.length);
  const overviewBottom = placements.reduce(
    (bottom, placement) => Math.max(bottom, placement.y + placement.height + 72),
    310,
  );

  measure.font = '28px Georgia, serif';
  const questionLines = input.question?.trim()
    ? wrapText(measure, `「${input.question.trim()}」`, 850)
    : [];
  measure.font = '28px Georgia, serif';
  const summaryLines = wrapText(measure, input.summary, 860);

  const detailLayouts = input.cards.map(card => {
    measure.font = '22px Georgia, serif';
    const keywordLines = wrapText(measure, `${input.labels.keywords}: ${card.keywords.join(' · ')}`, 680);
    measure.font = '24px Georgia, serif';
    const descriptionLines = wrapText(measure, card.description, 680);
    measure.font = '20px Georgia, serif';
    const positionLines = card.positionDescription
      ? wrapText(measure, card.positionDescription, 680)
      : [];
    const textHeight = 104
      + keywordLines.length * 32
      + descriptionLines.length * 38
      + positionLines.length * 31;
    return {
      keywordLines,
      descriptionLines,
      positionLines,
      height: Math.max(280, textHeight + 52),
    };
  });

  measure.font = '25px Georgia, serif';
  const patternLayouts = input.patterns.map(item => wrapText(measure, item, 820));
  const guidanceLayouts = input.guidance.map(item => wrapText(measure, item, 800));

  let cursor = overviewBottom + 80;
  if (questionLines.length) cursor += questionLines.length * 40 + 50;
  cursor += 70 + summaryLines.length * 42;
  cursor += 95;
  detailLayouts.forEach(layout => { cursor += layout.height + 28; });
  if (patternLayouts.length) {
    cursor += 100;
    patternLayouts.forEach(lines => { cursor += lines.length * 38 + 28; });
  }
  if (guidanceLayouts.length) {
    cursor += 100;
    guidanceLayouts.forEach(lines => { cursor += lines.length * 38 + 30; });
  }
  // Keep generous breathing room after variable-length translated copy.
  const canvasHeight = Math.max(1600, Math.ceil(cursor + 400));

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is unavailable');

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#07111f');
  gradient.addColorStop(1, '#02060c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(200,169,126,.65)';
  ctx.lineWidth = 3;
  ctx.strokeRect(52, 52, 976, canvas.height - 104);
  const starCount = Math.min(260, Math.max(70, Math.floor(canvas.height / 28)));
  for (let i = 0; i < starCount; i += 1) {
    const x = (i * 157) % 1000 + 40;
    const y = (i * 263) % (canvas.height - 100) + 50;
    ctx.fillStyle = `rgba(200,169,126,${0.15 + (i % 4) * 0.08})`;
    ctx.beginPath(); ctx.arc(x, y, i % 3 + 1, 0, Math.PI * 2); ctx.fill();
  }
  ctx.textAlign = 'center';
  ctx.fillStyle = '#c8a97e';
  ctx.font = '600 34px Georgia, serif';
  ctx.fillText(input.appName.toUpperCase(), 540, 125);
  ctx.fillStyle = '#f3eee5';
  ctx.font = '600 52px Georgia, serif';
  ctx.fillText(input.title, 540, 205);
  ctx.fillStyle = '#98acc8';
  ctx.font = '30px Georgia, serif';
  ctx.fillText(input.subtitle, 540, 255);

  const cardW = grid.cardWidth;
  const cardH = cardW * 1.5;

  input.cards.forEach((card, index) => {
    const { x, y } = placements[index];
    const centerX = x + cardW / 2;

    ctx.save();
    if (card.reversedLabel) {
      ctx.translate(centerX, y + cardH / 2);
      ctx.rotate(Math.PI);
      drawImageContained(ctx, images[index], -cardW / 2, -cardH / 2, cardW, cardH);
    } else drawImageContained(ctx, images[index], x, y, cardW, cardH);
    ctx.restore();
    ctx.strokeStyle = '#c8a97e';
    ctx.lineWidth = input.cards.length <= 3 ? 4 : 3;
    ctx.strokeRect(x, y, cardW, cardH);

    ctx.fillStyle = '#c8a97e';
    ctx.font = `${input.cards.length <= 3 ? 22 : 18}px Georgia, serif`;
    ctx.fillText(fitText(ctx, card.position, cardW + 28), centerX, y + cardH + 28);
    ctx.fillStyle = card.reversedLabel ? '#d4a0a0' : '#f3eee5';
    ctx.font = `600 ${input.cards.length <= 3 ? 24 : 19}px Georgia, serif`;
    const name = card.reversedLabel ? `${card.name} · ${card.reversedLabel}` : card.name;
    ctx.fillText(fitText(ctx, name, cardW + 38), centerX, y + cardH + 57);
  });

  let y = overviewBottom + 80;
  ctx.textAlign = 'center';
  if (questionLines.length) {
    ctx.fillStyle = '#98acc8';
    ctx.font = 'italic 28px Georgia, serif';
    y = drawLines(ctx, questionLines, 540, y, 40) + 50;
  }

  drawSectionHeading(ctx, input.labels.overall, y);
  y += 70;
  ctx.fillStyle = '#d9e0ea';
  ctx.font = '28px Georgia, serif';
  ctx.textAlign = 'left';
  y = drawLines(ctx, summaryLines, 110, y, 42) + 95;

  drawSectionHeading(ctx, input.labels.details, y);
  y += 55;
  input.cards.forEach((card, index) => {
    const layout = detailLayouts[index];
    const panelY = y;
    ctx.fillStyle = 'rgba(10,22,40,.82)';
    ctx.fillRect(72, panelY, 936, layout.height);
    ctx.strokeStyle = 'rgba(200,169,126,.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(72, panelY, 936, layout.height);

    const imageX = 96;
    const imageY = panelY + 34;
    const imageW = 140;
    const imageH = 210;
    ctx.save();
    if (card.reversedLabel) {
      ctx.translate(imageX + imageW / 2, imageY + imageH / 2);
      ctx.rotate(Math.PI);
      drawImageContained(ctx, images[index], -imageW / 2, -imageH / 2, imageW, imageH);
    } else drawImageContained(ctx, images[index], imageX, imageY, imageW, imageH);
    ctx.restore();
    ctx.strokeStyle = '#c8a97e';
    ctx.lineWidth = 3;
    ctx.strokeRect(imageX, imageY, imageW, imageH);

    const textX = 270;
    let textY = panelY + 40;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#c8a97e';
    ctx.font = '22px Georgia, serif';
    ctx.fillText(card.position, textX, textY);
    textY += 38;
    ctx.fillStyle = card.reversedLabel ? '#d4a0a0' : '#f3eee5';
    ctx.font = '600 31px Georgia, serif';
    ctx.fillText(card.reversedLabel ? `${card.name} · ${card.reversedLabel}` : card.name, textX, textY);
    if (card.secondaryName) {
      textY += 28;
      ctx.fillStyle = '#8192aa';
      ctx.font = '19px Georgia, serif';
      ctx.fillText(card.secondaryName, textX, textY);
    }
    textY += 38;
    ctx.fillStyle = '#c8a97e';
    ctx.font = '22px Georgia, serif';
    textY = drawLines(ctx, layout.keywordLines, textX, textY, 32) + 12;
    ctx.fillStyle = '#d9e0ea';
    ctx.font = '24px Georgia, serif';
    textY = drawLines(ctx, layout.descriptionLines, textX, textY, 38) + 12;
    if (layout.positionLines.length) {
      ctx.fillStyle = '#8fa0b7';
      ctx.font = 'italic 20px Georgia, serif';
      drawLines(ctx, layout.positionLines, textX, textY, 31);
    }
    y += layout.height + 28;
  });

  if (patternLayouts.length) {
    y += 50;
    drawSectionHeading(ctx, input.labels.patterns, y);
    y += 68;
    ctx.fillStyle = '#d9e0ea';
    ctx.font = '25px Georgia, serif';
    patternLayouts.forEach(lines => {
      ctx.fillStyle = '#c8a97e';
      ctx.fillText('✦', 100, y);
      ctx.fillStyle = '#d9e0ea';
      y = drawLines(ctx, lines, 140, y, 38) + 28;
    });
  }

  if (guidanceLayouts.length) {
    y += 50;
    drawSectionHeading(ctx, input.labels.guidance, y);
    y += 68;
    ctx.font = '25px Georgia, serif';
    guidanceLayouts.forEach((lines, index) => {
      ctx.fillStyle = '#c8a97e';
      ctx.fillText(`${index + 1}.`, 100, y);
      ctx.fillStyle = '#d9e0ea';
      y = drawLines(ctx, lines, 150, y, 38) + 30;
    });
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#8b9ab1';
  ctx.font = '25px Georgia, serif';
  ctx.fillText(input.footer, 540, canvas.height - 80);
  return new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Unable to render image')), 'image/png', 0.95));
}

function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function shareReadingCard(input: ShareCardInput) {
  const blob = await renderShareCard(input);
  const safeName = input.fileName.replace(/[^\p{L}\p{N}_-]+/gu, '_') + '.png';
  if (Capacitor.isNativePlatform()) {
    const data = await blobToBase64(blob);
    const file = await Filesystem.writeFile({ path: safeName, data, directory: Directory.Cache, recursive: true });
    try {
      await Share.share({ title: input.title, text: input.summary, url: file.uri, dialogTitle: input.title });
    } catch (error) {
      const message = typeof error === 'string'
        ? error
        : error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : '';
      if (/share cancell?ed/i.test(message)) return 'cancelled';
      throw error;
    }
    return 'shared';
  }
  // Browsers save a PNG directly; the iOS build above uses the native share sheet.
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = safeName;
  anchor.click();
  URL.revokeObjectURL(url);
  return 'downloaded';
}
