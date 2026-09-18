export function speakText(text) {
  if (!('speechSynthesis' in window) || !text) return;
  window.speechSynthesis.cancel(); // Stop ongoing speech
  const utterance = new SpeechSynthesisUtterance(text.replace('_', ' '));
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

export function drawLandmarksOnCanvas(ctx, rawResults, width, height) {
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  const drawPoints = (points, color) => {
    if (!points) return;
    ctx.fillStyle = color;
    for (const pt of points) {
      ctx.beginPath();
      ctx.arc(pt.x * width, pt.y * height, 3, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  drawPoints(rawResults.leftHandLandmarks, '#38bdf8');
  drawPoints(rawResults.rightHandLandmarks, '#34d399');
  drawPoints(rawResults.poseLandmarks, '#f43f5e');

  ctx.restore();
}