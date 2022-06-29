import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaUpload } from "react-icons/fa";
import { useDispatch } from "react-redux";
import ErrorBox from "../../components/ErrorBox/ErrorBox";
import Logo from "../../components/Logo/Logo";
import { AXIOS_INSTANCE, IS_CLIENT } from "../../constants";
import { updateProfileImg } from "../../store/reducer/auth";
import styles from "./index.module.scss";

interface formValues {
	img: any;
}

const Profile = () => {
	const [err, setErr] = useState("");
	const imgRef = useRef<HTMLImageElement>(null);
	const router = useRouter();
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<formValues>();

	const sendToServer = handleSubmit((data) => {
		if (data.img.length === 0) {
			setErr("Please upload a valid img");
			return;
		}

		let formdata = new FormData();
		formdata.append("img", data.img[0]);

		return AXIOS_INSTANCE.post("/account/upload-profile-img", formdata)
			.then(({ data: imgLink }) => {
				dispatch(updateProfileImg(imgLink));

				window.location.href = "/dashboard?tab=dashboard";
			})
			.catch((err) => {
				console.log(err);

				if (err.response.status === 409)
					setErr(
						`Account with ${err.response.data} already exists.<br/> ${
							IS_CLIENT && location.origin
						}/auth/login to login.`
					);
			});
	});
	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!imgRef.current) return;
		if (e.target.files?.length)
			imgRef.current.src = URL.createObjectURL(e.target.files[0]);
	};
	return (
		<motion.div className={styles.wrapper}>
			<div className={styles.logo}>
				<Logo />
			</div>
			<div className={styles.overlay} />
			<div className={styles.container}>
				<div className={styles.header}>
					<div className={styles.profile}>
						<img alt="" ref={imgRef} src="/assets/icons/user.svg" />
					</div>
				</div>
				<div className={styles.body}>
					{err && <ErrorBox className="mt-2" message={err} />}
					<form onSubmit={sendToServer}>
						<br />
						<div className="center_horizontal">
							<div className="file">
								<label className="file-label">
									<input
										className="file-input"
										{...register("img")}
										onChange={handleImageChange}
										accept="image/png, image/jpeg, image/jpg"
										type="file"
									/>
									<span className="file-cta">
										<span className="file-icon">
											<FaUpload />
										</span>
										<span className="file-label">Upload Img</span>
									</span>
								</label>
							</div>
						</div>

						<br />
						<button
							type="submit"
							className={`button mb-2 is-fullwidth is-black has-text-weight-medium ${
								isSubmitting && "is-loading"
							}`}>
							Save image
						</button>
						<button
							type="submit"
							className={`button is-fullwidth is-black is-inverted has-text-weight-medium ${
								isSubmitting && "is-loading"
							}`}>
							Skip
						</button>
					</form>
				</div>
			</div>
		</motion.div>
	);
};

export default Profile;
