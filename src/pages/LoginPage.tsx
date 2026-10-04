import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Building2, Scale, Store, Tractor } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { ROLES } from "../constants/rules";
import { Button } from "../components/ui/button";

const roles = [
  ["farmer", Tractor],
  ["retailer", Store],
  ["officer", Scale],
  ["government", Building2],
];

export default function LoginPage() {
  const [searchParams] = useSearchParams(); const searchRole = searchParams.get("role");
  const [role, setRole] = useState(searchRole || "farmer");
  const [name, setName] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();
  const enter = (demo = false) => {
    login(role);
    nav(`/${role}`);
  };
  return (
    <main className="grid min-h-screen bg-wash lg:grid-cols-[.8fr_1.2fr]">
      <section className="flex flex-col justify-between bg-soil p-7 text-dark-foreground lg:p-12">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <ArrowLeft size={18} /> OnionGrade
        </Link>
        <div className="my-20">
          <p className="eyebrow text-dark-muted-foreground">A shared standard</p>
          <h1 className="font-display text-5xl font-bold lg:text-7xl">
            One platform. Four points of view.
          </h1>
          <p className="mt-6 max-w-md text-dark-muted-foreground">
            Enter a role workspace to grade, source, process or oversee verified onion lots.
          </p>
        </div>
        <p className="text-xs text-dark-muted-foreground">DoCA Standard 2.4 · Secure role access</p>
      </section>
      <section className="grid place-items-center p-4 py-12">
        <div className="w-full max-w-2xl">
          <h2 className="font-display text-4xl">Choose your workspace</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {roles.map(([r, Icon]) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`rounded-xl border p-4 text-left capitalize transition ${r === role ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}
              >
                <Icon size={22} />
                <span className="mt-6 block text-sm font-semibold">{r}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Signing in as</p>
            <h3 className="font-display text-3xl capitalize">{role}</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                Name
                <input
                  className="field mt-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                />
              </label>
              <label className="text-sm">
                Phone
                <input className="field mt-2" placeholder="+91 98765 43210" />
              </label>
              <label className="text-sm">
                Email
                <input className="field mt-2" type="email" placeholder="name@example.in" />
              </label>
              <label className="text-sm">
                Mandi
                <select className="field mt-2">
                  <option>Lasalgaon APMC</option>
                  <option>Pimpalgaon</option>
                  <option>Mahuva</option>
                  <option>Kurnool</option>
                </select>
              </label>
            </div>
            <Button className="mt-6 w-full" onClick={() => enter(false)}>
              Authenticate as {role}
            </Button>
            <Button variant="outline" className="mt-3 w-full" onClick={() => enter(true)}>
              Enter as demo {role}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}



