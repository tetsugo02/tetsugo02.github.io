import { VscGithub } from "react-icons/vsc";
import { FaLinkedin } from "react-icons/fa";

const snsBarItems = {
	github: {
		url: "https://github.com/tetsugo02",
		icon: VscGithub,
	},
	linkedin: {
		url: "https://www.linkedin.com/in/哲豪-董-634413306/",
		icon: FaLinkedin,
	},
};

export const SnsBar = () => {
	return (
		<div className="flex items-center gap-5">
			<a
				href={snsBarItems.github.url}
				aria-label="GitHub"
				className="text-muted-foreground transition-colors hover:text-foreground"
				target="_blank"
				rel="noopener noreferrer"
			>
				<snsBarItems.github.icon size={22} />
			</a>
			<a
				href={snsBarItems.linkedin.url}
				aria-label="LinkedIn"
				className="text-muted-foreground transition-colors hover:text-foreground"
				target="_blank"
				rel="noopener noreferrer"
			>
				<snsBarItems.linkedin.icon size={22} />
			</a>
		</div>
	);
};
