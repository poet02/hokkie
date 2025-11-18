import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, LoginContainer } from "./styles";

export function Login() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");

  const handleLogin = () => {
    if (mobile.trim().length >= 10) {
      navigate("/search-places");
    }
  };

  return (
    <LoginContainer>
      <h2>Login</h2>
      <Input
        type="tel"
        placeholder="Enter mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <Button onClick={handleLogin}>Login</Button>
    </LoginContainer>
  );
}