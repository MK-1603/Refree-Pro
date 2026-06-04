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
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
  }

  static getMinute(ms: number): number {
    return Math.floor(ms / 60000) + 1;
  }
}
