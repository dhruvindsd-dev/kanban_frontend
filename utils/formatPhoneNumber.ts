export const phoneFormat = (num: any) => {
	num = num + "";
	const numWithoutDashes = num.replace(/[^0-9]/g, "");
	const dashPlaces = [3, 6];
	return numWithoutDashes
		.split("")
		.reduce((acc, curr, i) => (dashPlaces.includes(i) ? [...acc, "-", curr] : [...acc, curr]), [])
		.join("");
};
