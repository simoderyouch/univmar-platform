export type WorkspaceUser = {
  id: string;
  email: string;
  role: string;
};

type LoginResult = {
  accessToken: string;
  user: WorkspaceUser;
};

export type { LoginResult };
