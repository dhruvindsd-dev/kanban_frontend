export default function parseUrls(
	string: string,
	openInNewTab = true,
	linkText: string = "click here"
) {
	var urls = string.match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)/g);
	if (urls) {
		urls.forEach((url) => {
			string = string.replace(
				url,
				`<a style="text-decoration:underline" ${
					openInNewTab ? 'target = "_blank"' : ""
				} href="` +
					url +
					'">' +
					(linkText ?? url) +
					"</a>"
			);
		});
	}
	return string.replace("(", "<br/>(");
}
