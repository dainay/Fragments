import decode from "@audio/decode";
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const helperDirectory = dirname(fileURLToPath(import.meta.url));
const audioDirectory = resolve(helperDirectory, "../../frontend/public/audio");
const brightnessDirectory = resolve(helperDirectory, "../src/config/audioBrightness");

async function precalculateAudio(filepath) {
  const audio = await decode(readFileSync(filepath));
  const samples = audio.channelData[0];
  const stepMs = 100;
  const samplesPerStep = Math.round(audio.sampleRate * (stepMs / 1000));
  const values = [];

  for (let i = 0; i < samples.length; i += samplesPerStep) {
    let volume = 0;

    for (let j = i; j < Math.min(i + samplesPerStep, samples.length); j++) {
      volume = Math.max(volume, Math.abs(samples[j]));
    }

    values.push(volume < 0.01 ? 0 : Math.min(255, Math.round(volume * 255)));
  }

  const outputFile = resolve(
    brightnessDirectory,
    basename(filepath).replace(/\.mp3$/i, ".json"),
  );

  writeFileSync(outputFile, JSON.stringify({ stepMs, values }));
  console.log(`Created ${basename(outputFile)}`);
}

mkdirSync(brightnessDirectory, { recursive: true });

const audioFiles = readdirSync(audioDirectory).filter((file) =>
  file.toLowerCase().endsWith(".mp3"),
);

for (const file of audioFiles) {
  await precalculateAudio(resolve(audioDirectory, file));
}

console.log(`Finished: ${audioFiles.length} audio files`);
