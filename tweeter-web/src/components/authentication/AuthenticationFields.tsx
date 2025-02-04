import React from "react";

interface AuthenticationFieldsProps {
    alias: string;
    setAlias: (alias: string) => void;
    password: string;
    setPassword: (password: string) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
}

const AuthenticationFields: React.FC<AuthenticationFieldsProps> = ({
    alias,
    setAlias,
    password,
    setPassword,
    onKeyDown,
}) => {
    return (
        <>
            <div className="form-floating">
                <input
                    type="text"
                    className="form-control"
                    size={50}
                    id="aliasInput"
                    placeholder="name@example.com"
                    value={alias}
                    onKeyDown={onKeyDown}
                    onChange={(event) => setAlias(event.target.value)}
                />
                <label htmlFor="aliasInput">Alias</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    type="password"
                    className="form-control bottom"
                    id="passwordInput"
                    placeholder="Password"
                    value={password}
                    onKeyDown={onKeyDown}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <label htmlFor="passwordInput">Password</label>
            </div>
      </>
    );
};

export default AuthenticationFields;