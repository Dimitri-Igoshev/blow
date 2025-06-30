"use client";

import { Button } from "@heroui/button";
import React, { useState, useRef } from "react";
import { PiWaveform, PiRecordFill, PiStopFill } from "react-icons/pi";

import { useGetMeQuery, useUpdateUserMutation } from "@/redux/services/userApi";
import { config } from "@/common/env";

const VoiceRecorder = () => {
	const [recording, setRecording] = useState(false);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);

	const { data: me } = useGetMeQuery(null);
	const [update] = useUpdateUserMutation();

	const startRecording = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

		const options = MediaRecorder.isTypeSupported("audio/mp4")
			? { mimeType: "audio/mp4" }
			: MediaRecorder.isTypeSupported("audio/webm")
				? { mimeType: "audio/webm" }
				: {};

		const mediaRecorder = new MediaRecorder(stream, options);

		chunksRef.current = [];

		mediaRecorder.ondataavailable = (e) => {
			if (e.data.size > 0) {
				chunksRef.current.push(e.data);
			}
		};

		mediaRecorder.onstop = () => {
			const blob = new Blob(chunksRef.current, {
				type: mediaRecorder.mimeType,
			});
			const url = URL.createObjectURL(blob);

			setAudioUrl(url);

			// Пример отправки на сервер:
			const formData = new FormData();

			formData.append("files", blob, `recording.${blob.type.split("/")[1]}`); // Используем имя файла как 'audio.webm'

			update({
				id: me._id,
				body: formData,
			})
				.unwrap()
				.then((res) => console.log(res))
				.catch((err) => console.error(err));
		};

		mediaRecorder.start();
		mediaRecorderRef.current = mediaRecorder;
		setRecording(true);
	};

	const stopRecording = () => {
		mediaRecorderRef.current?.stop();
		setRecording(false);
	};

	const audioRef = useRef<any>(null);

	const handlePlay = () => {
		const audio = new Audio(
			`${config.MEDIA_URL}/${me?.voice}` || audioUrl || ""
		);
		audio.play().catch((err) => {
			console.error("Ошибка воспроизведения:", err);
		});
	};

	return (
		<div>
			<div className="flex items-center gap-3">
				{(me?.voice || audioUrl) && !recording ? (
					<button
						onClick={handlePlay}
						className="bg-primary text-white rounded-full h-[38px] px-3.5 flex gap-1 items-center"
					>
						<PiWaveform className="w-5 h-5" />
						<p>Прослушать</p>
					</button>
				) : null}
				<Button
					className="z-0 relative"
					color="secondary"
					radius="full"
					startContent={
						recording ? (
							<PiStopFill className="w-5 h-5" />
						) : (
							<PiRecordFill className="w-5 h-5" />
						)
					}
					variant="solid"
					onPress={recording ? stopRecording : startRecording}
				>
					{recording
						? "Остановить запись"
						: me?.voice
							? "Изменить запись"
							: "Записать голос"}
				</Button>
			</div>
		</div>
	);
};

export default VoiceRecorder;
