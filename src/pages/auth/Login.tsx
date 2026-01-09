import React, { useState, useEffect, useRef } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import LightPillar from "../../components/specific/LightPillar";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Flower2,
  Leaf,
  Activity,
  CheckCircle2,
  Mail,
  AlertCircle,
  XCircle,
  Clock,
  FileUp,
} from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../lib/api";
import { supabase } from "../../lib/supabase";

type AuthView = "signin" | "signup" | "review" | "rejected" | "otp";
type SignupStep = 1 | 2 | 3;
type DoctorType = "general" | "homeopathy" | "ayurvedic";

const Login = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<AuthView>("signin");
  const [signupStep, setSignupStep] = useState<SignupStep>(1);

  // Auth Data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  // Profile Data
  const [name, setName] = useState("");
  const [category, setCategory] = useState<DoctorType>("general");
  const [mobile, setMobile] = useState("");
  const [regNo, setRegNo] = useState("");
  const [council, setCouncil] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [govtIdFile, setGovtIdFile] = useState<File | null>(null);

  const licenseInputRef = useRef<HTMLInputElement>(null);
  const govtIdInputRef = useRef<HTMLInputElement>(null);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        const category = data.session.user.user_metadata?.category || "general";

        if (category === "homeopathy") navigate("/doctor/homeopathy");
        else if (category === "ayurvedic") navigate("/doctor/ayurvedic");
        else navigate("/doctor/general");
      }
    };

    checkSession();
  }, [navigate]);

  const handleSignup = async () => {
    setIsLoading(true);
    setError("");

    try {
      // In a real app, we would upload files to storage (like Supabase buckets)
      // and then send the URLs to the backend. 
      // For now, we'll send dummy URLs or handle it as needed.
      const response = await api.post("/api/auth/doctor/signup", {
        name,
        email,
        password,
        mobile,
        category,
        speciality,
        regNo,
        council,
        clinicName,
        city,
        state,
        licenseUrl: "mock-license-url", // Placeholder
        govtIdUrl: "mock-govt-id-url"    // Placeholder
      });

      console.log("Signup response:", response.data);
      setView("otp"); // After signup, show OTP verification
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/api/auth/doctor/signin", {
        email,
        password,
      });

      console.log("Signin response:", response.data);
      setView("otp");
    } catch (err: any) {
      console.error("Signin error:", err);
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await api.post("/api/auth/doctor/verify-otp", {
        email,
        otp,
      });
      const {
        token,
        status: userStatus,
        category: userCategory,
      } = response.data;

      localStorage.setItem("doctorToken", token);
      console.log(
        "Logged in with status:",
        userStatus,
        "category:",
        userCategory || category
      );

      // Navigate to appropriate dashboard
      const finalCategory = userCategory || category;

      if (userStatus === "VERIFIED" || userStatus === "EMAIL_VERIFIED") {
        if (finalCategory === "homeopathy") navigate("/doctor/homeopathy");
        else if (finalCategory === "ayurvedic") navigate("/doctor/ayurvedic");
        else navigate("/doctor/general");
      } else if (userStatus === "REJECTED") {
        setView("rejected");
      } else {
        setView("review");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(
        err.response?.data?.message || "Verification failed. Try 123456."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const doctorTypes = [
    {
      id: "general",
      label: "General Physician",
      icon: Activity,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      id: "homeopathy",
      label: "Homeopathist",
      icon: Flower2,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      id: "ayurvedic",
      label: "Ayurvedic Doctor",
      icon: Leaf,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#020617] relative overflow-hidden p-4 pt-40 pb-20">
      {/* Elegant Ambient Background - Forced Pointer Events None */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <LightPillar
          intensity={0.2}
          pillarWidth={12}
          rotationSpeed={0}
          topColor="#4f46e5"
          bottomColor="#9333ea"
          className="pointer-events-none"
        />
      </div>

      <div className="relative z-50 w-full max-w-2xl">
        {/* Modern Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative mb-4"
          >
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent" />
              <Stethoscope className="w-7 h-7 text-indigo-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight mb-1">
              Care4You{" "}
              <span className="text-indigo-400/80 font-medium">Healthcare</span>
            </h1>
          </motion.div>
        </div>

        {/* AUTH CARD */}
        <Card className="backdrop-blur-2xl bg-slate-950/60 border-white/10 p-0.5 overflow-hidden shadow-2xl">
          <div className="bg-slate-900/90 rounded-[calc(1.5rem-4px)] p-6 md:p-10">
            {/* VIEW TOGGLE */}
            {(view === "signin" || view === "signup") && (
              <div className="flex p-1 bg-slate-950 rounded-xl mb-8 w-fit mx-auto border border-white/5">
                <button
                  onClick={() => {
                    setView("signin");
                    setError("");
                  }}
                  className={clsx(
                    "px-8 py-2 text-sm font-bold rounded-lg transition-all duration-300",
                    view === "signin"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setView("signup");
                    setError("");
                  }}
                  className={clsx(
                    "px-8 py-2 text-sm font-bold rounded-lg transition-all duration-300",
                    view === "signup"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  Register
                </button>
              </div>
            )}

            <AnimatePresence mode="wait">
              {view === "signin" && (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="max-w-sm mx-auto"
                >
                  <form onSubmit={handleSignin} className="space-y-5">
                    <div className="space-y-1">
                      <Input
                        label="Professional Email"
                        placeholder="doctor@care4you.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-slate-950 border-white/10 h-11"
                      />
                    </div>

                    <div className="space-y-1">
                      <Input
                        label="Secret Code"
                        placeholder="••••••••"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-slate-950 border-white/10 h-11"
                      />
                    </div>

                    {error && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                      isLoading={isLoading}
                    >
                      Authorize Access
                    </Button>
                  </form>
                </motion.div>
              )}

              {view === "signup" && (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* PROGRESS STEPPER */}
                  <div className="flex items-center justify-between mb-8 px-4 max-w-sm mx-auto">
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className="flex items-center flex-1 last:flex-none"
                      >
                        <div
                          className={clsx(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all border-2",
                            signupStep === s
                              ? "bg-indigo-600 border-indigo-500 text-white"
                              : signupStep > s
                                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                                : "bg-slate-950 border-white/10 text-slate-600"
                          )}
                        >
                          {signupStep > s ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            s
                          )}
                        </div>
                        {s < 3 && (
                          <div className="h-[2px] flex-1 mx-2 bg-slate-800 rounded-full">
                            <div
                              className={clsx(
                                "h-full transition-all duration-500",
                                signupStep > s
                                  ? "w-full bg-emerald-500"
                                  : signupStep === s
                                    ? "w-1/2 bg-indigo-500"
                                    : "w-0"
                              )}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="min-h-[280px]">
                    {signupStep === 1 && (
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                            Portal Specialization
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {doctorTypes.map((type) => (
                              <button
                                key={type.id}
                                type="button"
                                onClick={() => setCategory(type.id)}
                                className={clsx(
                                  "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                                  category === type.id
                                    ? `bg-slate-950 border-indigo-500`
                                    : "bg-slate-950/40 border-transparent text-slate-600 hover:border-white/5"
                                )}
                              >
                                <type.icon
                                  className={clsx(
                                    "w-5 h-5",
                                    category === type.id
                                      ? type.color
                                      : "text-slate-600"
                                  )}
                                />
                                <span className="text-[9px] font-bold text-center">
                                  {type.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            label="Doctor's Name"
                            placeholder="Legal Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="bg-slate-950 h-10"
                          />
                          <Input
                            label="Email Identity"
                            placeholder="doctor@clinic.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-slate-950 h-10"
                          />
                          <Input
                            label="Mobile Contact"
                            placeholder="+91"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            required
                            className="bg-slate-950 h-10"
                          />
                          <Input
                            label="Secure Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-slate-950 h-10"
                          />
                        </div>
                      </div>
                    )}

                    {signupStep === 2 && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          label="Medical Reg. No"
                          placeholder="MCI-XXXXXX"
                          value={regNo}
                          onChange={(e) => setRegNo(e.target.value)}
                          required
                          className="bg-slate-950 h-10"
                        />
                        <Input
                          label="Medical Council"
                          placeholder="State/National"
                          value={council}
                          onChange={(e) => setCouncil(e.target.value)}
                          required
                          className="bg-slate-950 h-10"
                        />
                        <Input
                          label="Clinic/Hospital"
                          placeholder="Facility Name"
                          value={clinicName}
                          onChange={(e) => setClinicName(e.target.value)}
                          required
                          className="bg-slate-950 h-10"
                        />
                        <Input
                          label="Speciality"
                          placeholder="Area of Focus"
                          value={speciality}
                          onChange={(e) => setSpeciality(e.target.value)}
                          required
                          className="bg-slate-950 h-10"
                        />
                        <Input
                          label="City"
                          placeholder="City"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                          className="bg-slate-950 h-10"
                        />
                        <Input
                          label="State"
                          placeholder="State"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          required
                          className="bg-slate-950 h-10"
                        />
                      </div>
                    )}

                    {signupStep === 3 && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="file"
                            ref={licenseInputRef}
                            onChange={(e) =>
                              setLicenseFile(e.target.files?.[0] || null)
                            }
                            className="hidden"
                            accept="application/pdf,image/*"
                          />
                          <input
                            type="file"
                            ref={govtIdInputRef}
                            onChange={(e) =>
                              setGovtIdFile(e.target.files?.[0] || null)
                            }
                            className="hidden"
                            accept="application/pdf,image/*"
                          />

                          <div
                            onClick={() => licenseInputRef.current?.click()}
                            className={clsx(
                              "p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group text-center",
                              licenseFile
                                ? "border-emerald-500 bg-emerald-500/5"
                                : "border-white/10 bg-slate-950 hover:border-indigo-500"
                            )}
                          >
                            {licenseFile ? (
                              <>
                                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                <span className="text-[9px] font-bold text-emerald-400 uppercase truncate max-w-full px-2">
                                  {licenseFile.name}
                                </span>
                              </>
                            ) : (
                              <>
                                <FileUp className="w-6 h-6 text-slate-600 group-hover:text-indigo-400" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase">
                                  License
                                </span>
                              </>
                            )}
                          </div>

                          <div
                            onClick={() => govtIdInputRef.current?.click()}
                            className={clsx(
                              "p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group text-center",
                              govtIdFile
                                ? "border-emerald-500 bg-emerald-500/5"
                                : "border-white/10 bg-slate-950 hover:border-indigo-500"
                            )}
                          >
                            {govtIdFile ? (
                              <>
                                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                <span className="text-[9px] font-bold text-emerald-400 uppercase truncate max-w-full px-2">
                                  {govtIdFile.name}
                                </span>
                              </>
                            ) : (
                              <>
                                <FileUp className="w-6 h-6 text-slate-600 group-hover:text-indigo-400" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase">
                                  Govt ID
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-lg">
                          <p className="text-[9px] text-red-400 leading-relaxed font-medium">
                            Submission of fraudulent data will be reported to
                            clinical authorities.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3 mt-8 pt-6 border-t border-white/5">
                    {signupStep > 1 && (
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setSignupStep((s) => (s - 1) as SignupStep)
                        }
                        className="flex-1 h-10 border border-white/10 text-slate-400"
                      >
                        Back
                      </Button>
                    )}
                    {signupStep < 3 ? (
                      <Button
                        onClick={() =>
                          setSignupStep((s) => (s + 1) as SignupStep)
                        }
                        className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                      >
                        Next Step
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSignup}
                        isLoading={isLoading}
                        className="flex-1 h-10 bg-white text-slate-950 hover:bg-slate-200 font-bold"
                      >
                        Complete Registration
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}

              {view === "otp" && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="inline-flex p-3 rounded-xl bg-indigo-500/10 mb-6">
                    <Mail className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Verify Clinical License
                  </h3>
                  <p className="text-slate-500 text-[10px] mb-8 font-bold">
                    OTP SEND TO:{" "}
                    <span className="text-indigo-300">{email}</span>
                    <br />
                    <span className="text-indigo-500/50 mt-1 block">
                      (DEMO CODE: 123456)
                    </span>
                  </p>
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <Input
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="text-center text-2xl font-black tracking-[0.5em] h-16 bg-slate-950"
                      required
                    />
                    <Button
                      type="submit"
                      className="w-full h-11 bg-indigo-600"
                      isLoading={isLoading}
                    >
                      Verify Code
                    </Button>
                  </form>
                </motion.div>
              )}

              {view === "review" && (
                <motion.div key="review" className="text-center">
                  <Clock className="w-10 h-10 text-amber-500 mx-auto mb-6 animate-pulse" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Registration Under Final Review
                  </h3>
                  <p className="text-slate-500 text-sm mb-10">
                    Our medical compliance team is verifying your registration
                    number.
                  </p>
                  <Button
                    onClick={() => setView("signin")}
                    variant="ghost"
                    className="w-full text-slate-400"
                  >
                    Sign In (Check Status)
                  </Button>
                </motion.div>
              )}

              {view === "rejected" && (
                <motion.div key="rejected" className="text-center">
                  <XCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-white mb-4">
                    Verification Denied
                  </h3>
                  <p className="text-slate-500 text-sm mb-10">
                    Clinical documents provided could not be verified.
                  </p>
                  <Button
                    onClick={() => setView("signin")}
                    variant="outline"
                    className="w-full"
                  >
                    Return Home
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        <p className="mt-8 text-center text-[9px] text-slate-700 font-bold uppercase tracking-[0.3em]">
          Enterprise Medical OS • HIPAA Standard
        </p>
      </div>
    </div>
  );
};

export default Login;
