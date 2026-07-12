import { NextResponse } from "next/server";
import os from "os";

export async function GET() {
  return NextResponse.json({
    hostname: os.hostname(),
    pid: process.pid,
    timestamp: new Date().toISOString(),
  });
}
