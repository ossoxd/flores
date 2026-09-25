export function jumpPose(elapsed) {
  const airborne = elapsed >= 80 && elapsed < 480;
  return {
    height: airborne ? Math.sin((elapsed-80)/400*Math.PI)*30 : 0,
    frame: elapsed < 80 ? 0 : airborne ? 1 : 2,
    finished: elapsed >= 600
  };
}
