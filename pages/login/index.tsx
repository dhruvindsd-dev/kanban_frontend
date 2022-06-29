import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import ErrorBox from "../../components/ErrorBox/ErrorBox";
import Input from "../../components/Form/Input/Input";
import Logo from "../../components/Logo/Logo";
import { AXIOS_INSTANCE } from "../../constants";
import { login } from "../../store/reducer/auth";
import styles from "./index.module.scss";

interface LoginProps {}

type formValues = {
	emailOrPhone: string;
	password: string;
};

const Login = ({}: LoginProps) => {
	const [err, setErr] = useState("");
	const router = useRouter();
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<formValues>();
	const [captcha, setcaptcha] = useState({
		didVerify: false,
		key: "",
	});

	const onSubmit = handleSubmit((data) => {
		router.prefetch("/dashboard");
		if (!captcha.didVerify) {
			setErr("Pleaase Complete the Captcha to Continue");
			return;
		}
		return AXIOS_INSTANCE.post("account/login", data)
			.then(({ data: { token, firstName } }) => {
				dispatch(login({ token, firstName }));
				window.location.replace("/dashboard?tab=dashboard");
			})
			.catch(({ response: { status } }) => {
				if (status === 404) setErr("Incorrect Username or Password.");
			});
	});

	return (
		<div className={styles.wrapper}>
			<div className={styles.logo}>
				<Logo />
			</div>
			<div className={styles.overlay} />
			<div className={styles.container}>
				<span className={`${styles.bar} ${styles.l_first}`} />
				<span className={`${styles.bar} ${styles.r_first}`} />
				<span className={`${styles.bar} ${styles.r_second}`} />
				<div className={styles.header}>
					<div className={`image ${styles.header_img}`}>
						<img src="/assets/images/login.png" alt="" />
					</div>
				</div>
				<div className={styles.body}>
					<div className="has-text-centered">
						<p className="is-size-3 has-text-weight-bold has-text-black">
							Welcome back!
						</p>
						<p className="has-text-grey">You&apos;ve been missed</p>
					</div>
					<br />
					<button className="button is-grey is-light is-fullwidth">
						<span className="icon is-medium mr-3">
							<FcGoogle size={32} />
						</span>
						<span>Login with Google</span>
					</button>
					<div className={styles.divider}>
						<span className={styles.line}></span>
						<span className="has-text-grey-light is-size-7 has-text-weight-bold mx-3">
							OR
						</span>
						<span className={styles.line}></span>
					</div>
					<form onSubmit={onSubmit}>
						{err && <ErrorBox className="mt-2" message={err} />}
						<Input
							label="EMAIL OR USERNAME"
							{...register("emailOrPhone", {
								required: "Email cannot be empty.",
							})}
							error={errors.emailOrPhone}
						/>
						<Input
							label="PASSWORD"
							{...register("password", {
								required: "Password cannot be empty.",
							})}
							error={errors.password}
						/>

						<div className="mt-4" />
						<ReCAPTCHA
							onChange={(key) => setcaptcha({ didVerify: true, key })}
							onExpired={() => setcaptcha({ didVerify: false, key: "" })}
							sitekey="6Ld76qYgAAAAAJCSWTHG6TN8vD3wrc7uYpxUopmD"
						/>

						<br />
						<button
							type="submit"
							className={`button  is-fullwidth is-black has-text-weight-medium ${
								isSubmitting && "is-loading"
							}`}>
							LOG IN
						</button>

						<p className="is-size-7 mt-2">
							Don&apos;t have an account?{" "}
							<Link href="register">
								<a
									href="register"
									className="has-text-info has-text-weight-semibold">
									SIGN UP
								</a>
							</Link>
						</p>
					</form>
				</div>
			</div>
		</div>
	);
};
export default Login;
