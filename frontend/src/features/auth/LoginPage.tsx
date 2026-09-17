import { useState, type FormEvent } from "react";
import { Redirect, useRouter } from "../../app/providers/router";
import { useToast } from "../../app/providers/toast-provider";
import { RequestError } from "../../shared/api/client";
import { Button, TextField } from "../../shared/ui";
import { useAuth } from "./AuthProvider";

export function LoginPage() {
  const { user, login } = useAuth();
  const { navigate } = useRouter();
  const notify = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Redirect to="/dashboard" />;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      await login(email, password);
      notify("Welcome to UNIVMAR.");
      navigate("/dashboard", true);
    } catch (error) {
      const problem = error as RequestError;
      setErrors(problem.fields);
      notify(problem.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#f7f3f0] lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden bg-[#110703] p-12 text-white lg:flex lg:flex-col">
        <img src="/univmar-logo-w.png" alt="Univmar Marble" className="h-auto w-48 object-contain object-left" />
        <div className="my-auto max-w-md">
          <p className="text-[10px] font-bold tracking-[0.16em] text-[#d0ad7d]">STONE COMPANY MANAGEMENT</p>
          <h1 className="mt-5 font-serif text-5xl leading-tight">One place for the work behind remarkable stone.</h1>
          <p className="mt-6 text-sm leading-6 text-white/60">A secure workspace for your catalogue, inventory, customers, orders, and deliveries.</p>
        </div>
        <p className="text-xs text-white/35">Secure company workspace</p>
      </section>
      <section className="grid place-items-center p-6 sm:p-10">
        <form onSubmit={submit} className="w-full max-w-sm">
          <p className="text-[10px] font-extrabold tracking-[0.16em] text-[#856958]">ADMIN WORKSPACE</p>
          <h2 className="mt-2 font-serif text-4xl tracking-tight">Sign in</h2>
          <p className="mt-2 text-sm leading-6 text-[#786961]">Use the administrator account configured for this environment.</p>
          <div className="mt-8 grid gap-4">
            <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} error={errors.email} placeholder="admin@univmar.local" required />
            <TextField label="Password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} error={errors.password} required />
            <Button type="submit" loading={submitting} className="mt-2 w-full">Sign in</Button>
          </div>
        </form>
      </section>
    </main>
  );
}
