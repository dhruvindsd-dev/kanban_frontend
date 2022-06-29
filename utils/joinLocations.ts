export default function joinLocations<T>(args: T[], sep = ", ") {
	let temp1: T[] = [];
	args.map((item) => !!item && temp1.push(item));
	return temp1.join(sep);
}
