export class MatchTimer {
  static calculateElapsed(
    startedAtUnix: number,
    totalPausedMs: number,
    pausedAtUnix?: number | null,
    isRunning: boolean = true
  ): number {
    if (!isRunning && pausedAtUnix) {
      return pausedAtUnix - startedAtUnix - totalPausedMs;
    }
    if (!isRunning) return 0;
    return Date.now() - startedAtUnix - totalPausedMs;
  }

  static formatDisplay(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  static getMinute(ms: number): number {
    return Math.floor(ms / 60000) + 1;
  }
}
