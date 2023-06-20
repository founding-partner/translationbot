import { useEffect, useState } from 'react';
import CodeEditor from './CodeEditor';
import { Octokit } from 'octokit';

export const DashBoard = ({ token }: { token: string; }): JSX.Element => {
  const [repos, setRepos] = useState<string | null>(null);

  useEffect(() => {
    if (token !== null) {
      console.log('token received');
      loadApi();
    }
  }, [token]);

  const loadApi = (): void => {
    // Now you can use the access token with Octokit
    const octokit = new Octokit({
      auth: `token ${token}`
    });

    // For example, to get the authenticated user's repos:
    octokit.rest.repos.listForAuthenticatedUser().then(({ data }) => {
      console.log(data);
      setRepos(data.toString());
    });
  };
  return (
    <>
      <div className="font-bold text-white">
        <span>Token: {token}</span>
      </div>
      <button className="bg-gray-900 text-white font-bold px-4 py-2" onClick={loadApi}>
        load list
      </button>
      {repos !== null && <CodeEditor defaultCode={repos} />}
    </>
  );
};
