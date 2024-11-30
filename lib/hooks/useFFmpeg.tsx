import { useRef, useState } from 'react';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

// const extractVideoThumbnailCommand =
//   '-i input.video -ss 00:00:00.000 -vframes 1 output.jpg';

// extract audio from video and reduce the quality (enough for speech recognition) to reduce file size
const extractAudioCommand =
  '-i input.video -vn -acodec libmp3lame -ac 1 -ar 16000 -b:a 48k output.mp3';

export const useFFmpeg = () => {
  const ffmpegRef = useRef(new FFmpeg());

  const [isWasmLibLoaded, setWasmLibLoaded] = useState(false);
  const [isWasmLibLoading, setWasmLibLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTranscoding, setTranscoding] = useState(false);
  const [log, setLog] = useState<string>('');

  const loadWasmBinary = async () => {
    if (isWasmLibLoaded) {
      return;
    }

    setWasmLibLoading(true);

    try {
      const ffmpeg = ffmpegRef.current;

      setLog('');
      ffmpeg.on('log', ({ message }) => {
        console.log(message);
        setLog((log) => log + '\n' + message);
      });

      // toBlobURL is used to bypass CORS issue, urls with the same
      // domain can be used directly.
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          'text/javascript',
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          'application/wasm',
        ),
      });

      setWasmLibLoaded(true);
    } catch (error) {
      setError(typeof error === 'string' ? error : JSON.stringify(error));
    } finally {
      setWasmLibLoading(false);
    }
  };

  const transcodeVideoToAudio = async (
    file: File,
  ): Promise<{
    // thumbnail?: Uint8Array;
    audio?: Uint8Array;
  }> => {
    setTranscoding(true);

    await loadWasmBinary();

    const ffmpeg = ffmpegRef.current;

    if (!ffmpegRef) {
      throw new Error('ffmpegRef is not initialized');
    }

    // Use input.video as generic name to handle both mp4 and m4v
    const inputName = 'input.video';
    await ffmpeg.writeFile(inputName, new Uint8Array(await file.arrayBuffer()));

    // setLog(
    //   (log) =>
    //     log + '\n' + '-------------------------------------------------------',
    // );

    // await ffmpeg.exec(extractVideoThumbnailCommand.split(' '));
    // const thumbnail = (await ffmpeg.readFile('output.jpg')) as Uint8Array;

    setLog(
      (log) =>
        log + '\n' + '-------------------------------------------------------',
    );

    await ffmpeg.exec(extractAudioCommand.split(' '));
    const audio = (await ffmpeg.readFile('output.mp3')) as Uint8Array;

    setTranscoding(false);

    return {
      // thumbnail,
      audio,
    };
  };

  const cleanUp = async () => {
    const ffmpeg = ffmpegRef.current;

    if (!ffmpeg) {
      return;
    }

    await Promise.allSettled([
      ffmpeg.deleteFile('input.video'),
      ffmpeg.deleteFile('output.jpg'),
      ffmpeg.deleteFile('output.mp3'),
    ]);

    setLog('');
  };

  return {
    isWasmLibLoading,
    isTranscoding,
    loadError: error,
    log,
    loadWasmBinary,
    transcodeVideoToAudio,
    cleanUp,
  };
};
