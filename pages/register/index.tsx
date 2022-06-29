import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import ErrorBox from "../../components/ErrorBox/ErrorBox";
import Input from "../../components/Form/Input/Input";
import Logo from "../../components/Logo/Logo";
import { AXIOS_INSTANCE, EMAIL_REGEX, IS_CLIENT } from "../../constants";
import { register as reduxRegister } from "../../store/reducer/auth";
import { phoneFormat } from "../../utils/formatPhoneNumber";
import styles from "./index.module.scss";

interface RegisterProps {}

type formValues = {
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	password: string;
	username: string;
};

const Register = ({}: RegisterProps) => {
	const [err, setErr] = useState("");
	const router = useRouter();

	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<formValues>();
	// if (authContext.token || authContext.email) router.push("/dashboard");
	const sendToServer = handleSubmit((data) => {
		return AXIOS_INSTANCE.post("/account/register", data)
			.then(({ data: { token, firstName } }) => {
				dispatch(reduxRegister({ firstName, token }));
				window.location.href = "/register/profile";
			})
			.catch((err) => {
				if (err.response.status === 409)
					setErr(
						`Account with ${err.response.data} already exists.<br/> ${
							IS_CLIENT && location.origin
						}/auth/login to login.`
					);
			});
	});
	return (
		<motion.div className={styles.wrapper}>
			<div className={styles.logo}>
				<Logo />
			</div>
			<div className={styles.overlay} />
			<div className={styles.container}>
				<div className={styles.header}>
					<div className={`image ${styles.header_img} p-0`}>
						<img
							src="assets/images/register.png"
							alt=""
							height="509"
							width="686"
						/>
					</div>
				</div>
				<div className={styles.body}>
					<div className="has-text-centered">
						<p className="is-size-3 has-text-weight-bold has-text-black">
							Managing your day is easier then you think
						</p>
						<p className="has-text-grey">Welcome to kando!!!</p>
					</div>
					<br />
					<button className="button is-grey is-light is-fullwidth">
						<span className="icon is-medium mr-3">
							<FcGoogle size={32} />
						</span>

						<span>Signup with Google</span>
					</button>
					<div className={styles.divider}>
						<span className={styles.line}></span>
						<span className="has-text-grey-light is-size-7 has-text-weight-bold mx-3">
							OR
						</span>
						<span className={styles.line}></span>
					</div>

					{err && <ErrorBox className="mt-2" message={err} />}
					<form onSubmit={sendToServer}>
						<div className={`${styles.columns} ${styles["is-gapless"]} mb-0`}>
							<div className={`${styles.column}`}>
								<Input
									label="FIRST NAME"
									{...register("firstName", {
										required: "First Name cannot be empty.",
										min: {
											value: 3,
											message: "First Name must of minimum 3 characters",
										},
									})}
									error={errors.firstName}
								/>
							</div>
							<div className="ml-4" />
							<div className={`${styles.column}`}>
								<Input
									label="LAST NAME"
									{...register("lastName", {
										required: "Last Name cannot be empty.",
										min: {
											value: 3,
											message: "Last Name must of minimum 3 characters",
										},
									})}
									error={errors.lastName}
								/>
							</div>
						</div>
						<Input
							label="EMAIL"
							{...register("email", {
								pattern: {
									value: EMAIL_REGEX,
									message: "Please enter a valid email",
								},
								required: "Email cannot be empty.",
							})}
							error={errors.email}
						/>
						<Input
							label="USERNAME"
							{...register("username", {
								required: "Username cannot be empty.",
							})}
							error={errors.email}
						/>

						<Input
							label="PHONE NUMBER"
							{...register("phone", {
								minLength: {
									message: "Phone number must be at least 10 digits long",
									value: 12,
								},
								maxLength: {
									message: "Phone number must be less than 10 digits",
									value: 13,
								},
								onChange: (val) =>
									setValue("phone", phoneFormat(val.target.value)),
							})}
							error={errors.phone}
							icon={<span className="has-text-weight-bold is-size-7">+91</span>}
						/>
						<Input
							label="PASSWORD"
							{...register("password", {
								required: "Password cannot be empty.",
							})}
							error={errors.password}
						/>
						<br />
						<button
							type="submit"
							className={`button is-fullwidth is-black has-text-weight-medium ${
								isSubmitting && "is-loading"
							}`}>
							SIGN UP
						</button>
						<p className="is-size-7 mt-2">
							Already have an account?{" "}
							<Link href="./login">
								<a className="has-text-info has-text-weight-semibold">LOG IN</a>
							</Link>
						</p>
					</form>
				</div>
			</div>
		</motion.div>
	);
};

export default Register;
