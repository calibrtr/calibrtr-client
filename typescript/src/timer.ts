


export class LatencyTimer {
    private startTime: number;
    private endTime: number;
    private duration: number;

    constructor() {
        this.startTime = 0;
        this.endTime = 0;
        this.duration = 0;
    }

    public start(): void {
        this.startTime = Date.now();
    }

    public stop(): void {
        this.endTime = Date.now();
        this.duration = this.endTime - this.startTime;
    }

    public getDuration(): number {
        this.stop();
        return this.duration;
    }
}

export const startLatencyTimer = () =>{
    const timer = new LatencyTimer();
    timer.start();
    return timer;
}