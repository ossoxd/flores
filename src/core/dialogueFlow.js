export function createDialogue(lines) {
  return { lines: [...lines], index: 0, finished: lines.length === 0 };
}

export function advanceDialogue(flow) {
  if (flow.finished) {
    return flow;
  }

  const nextIndex = flow.index + 1;
  return {
    ...flow,
    index: Math.min(nextIndex, flow.lines.length - 1),
    finished: nextIndex >= flow.lines.length
  };
}
