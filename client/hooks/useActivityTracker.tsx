import { useSetActivityMutation } from "@/redux/services/userApi";
import { useEffect } from "react";

export const useActivityTracker = (id = "") => {
	const [setActivity] = useSetActivityMutation();

	useEffect(() => {
		// if (!id) return;

		const activityHandler = () => {
			console.log("Activity tracked");

			setActivity({ id, body: { timestamp: new Date() } })
				.unwrap()
				.then(() => console.log("Activity logged"))
				.catch((err) => console.error(err));
		};

		const events = ["mousemove", "keydown", "click"];

		events.forEach((event) => window.addEventListener(event, activityHandler));

		return () => {
			events.forEach((event) =>
				window.removeEventListener(event, activityHandler)
			);
		};
	}, []);
};
