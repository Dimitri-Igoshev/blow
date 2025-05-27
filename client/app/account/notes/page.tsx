"use client";

import { NoteCard } from "@/components/NoteCard"
import { useGetMeQuery } from "@/redux/services/userApi";

export default function AccountNotes() {
	const { data: me } = useGetMeQuery(null);

	return (
		<div className="flex w-full flex-col px-9 h-screen pt-[84px] gap-[30px]">
			<div className="flex w-full items-center justify-between">
				<h1 className="font-semibold text-[36px]">Заметки</h1>
			</div>

			{me?.notes ? (
				<div className="flex flex-col gap-3">
					{me.notes.map((note: any) => (
						<NoteCard note={note} key={note._id} />
					))}
				</div>
			) : (
				<p>Еще нет заметок...</p>
			)}
		</div>
	);
}
