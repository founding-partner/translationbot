import { MarkGithubIcon } from '@primer/octicons-react';

export const LoginWithGithub = ({ handleLogin }: { handleLogin: () => void; }): JSX.Element => {
  return (
    <button
      className="bg-gray-900 hover:bg-black text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2"
      onClick={handleLogin}
    >
      <MarkGithubIcon size={24} />
      <span>Login with GitHub</span>
    </button>
  );
};
