import { useMutation, useQuery } from '@tanstack/react-query';
import { graphqlRequest } from '@/lib/queryClient';

// GraphQL fragments for reuse
const USER_FRAGMENT = `
  fragment UserFields on User {
    id
    username
    profiles {
      id
      userId
      name
      avatar
    }
  }
`;

// GraphQL queries
const CURRENT_USER_QUERY = `
  ${USER_FRAGMENT}
  query Me {
    me {
      ...UserFields
    }
  }
`;

// GraphQL mutations
const LOGIN_MUTATION = `
  ${USER_FRAGMENT}
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        ...UserFields
      }
    }
  }
`;

const SIGNUP_MUTATION = `
  ${USER_FRAGMENT}
  mutation Signup($username: String!, $password: String!) {
    signup(username: $username, password: $password) {
      token
      user {
        ...UserFields
      }
    }
  }
`;

const CREATE_PROFILE_MUTATION = `
  mutation CreateProfile($name: String!, $avatar: String!) {
    createProfile(name: $name, avatar: $avatar) {
      id
      userId
      name
      avatar
    }
  }
`;

const UPDATE_PROFILE_MUTATION = `
  mutation UpdateProfile($id: Int!, $name: String, $avatar: String) {
    updateProfile(id: $id, name: $name, avatar: $avatar) {
      id
      userId
      name
      avatar
    }
  }
`;

const DELETE_PROFILE_MUTATION = `
  mutation DeleteProfile($id: Int!) {
    deleteProfile(id: $id)
  }
`;

// Interface definitions
interface User {
  id: number;
  username: string;
  profiles: Profile[];
}

interface Profile {
  id: number;
  userId: number;
  name: string;
  avatar: string;
}

interface AuthPayload {
  token: string;
  user: User;
}

// Hook for GraphQL authentication
export function useGraphQLAuth() {
  // Get the stored token from localStorage
  const getToken = () => localStorage.getItem('auth_token');
  const setToken = (token: string) => localStorage.setItem('auth_token', token);
  const removeToken = () => localStorage.removeItem('auth_token');

  // Current user query
  const { 
    data: userData, 
    isLoading, 
    error,
    refetch
  } = useQuery<{ me: User | null }>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const token = getToken();
      if (!token) return { me: null };
      
      try {
        return await graphqlRequest(CURRENT_USER_QUERY, {}, token);
      } catch (error) {
        // If token is invalid, remove it
        removeToken();
        throw error;
      }
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const data = await graphqlRequest<{ login: AuthPayload }>(LOGIN_MUTATION, { username, password });
      return data.login;
    },
    onSuccess: (data) => {
      setToken(data.token);
      refetch(); // Refetch the current user
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const data = await graphqlRequest<{ signup: AuthPayload }>(SIGNUP_MUTATION, { username, password });
      return data.signup;
    },
    onSuccess: (data) => {
      setToken(data.token);
      refetch(); // Refetch the current user
    },
  });

  // Logout function
  const logout = () => {
    removeToken();
    refetch(); // Refetch to clear the current user
  };

  // Create profile mutation
  const createProfileMutation = useMutation({
    mutationFn: async ({ name, avatar }: { name: string; avatar: string }) => {
      const token = getToken();
      if (!token) throw new Error('Not authenticated');
      
      const data = await graphqlRequest<{ createProfile: Profile }>(
        CREATE_PROFILE_MUTATION, 
        { name, avatar }, 
        token
      );
      return data.createProfile;
    },
    onSuccess: () => {
      refetch(); // Refetch to update the profiles list
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async ({ id, name, avatar }: { id: number; name?: string; avatar?: string }) => {
      const token = getToken();
      if (!token) throw new Error('Not authenticated');
      
      const data = await graphqlRequest<{ updateProfile: Profile }>(
        UPDATE_PROFILE_MUTATION, 
        { id, name, avatar }, 
        token
      );
      return data.updateProfile;
    },
    onSuccess: () => {
      refetch(); // Refetch to update the profiles list
    },
  });

  // Delete profile mutation
  const deleteProfileMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = getToken();
      if (!token) throw new Error('Not authenticated');
      
      const data = await graphqlRequest<{ deleteProfile: boolean }>(
        DELETE_PROFILE_MUTATION, 
        { id }, 
        token
      );
      return data.deleteProfile;
    },
    onSuccess: () => {
      refetch(); // Refetch to update the profiles list
    },
  });

  return {
    user: userData?.me || null,
    isLoading,
    error,
    isAuthenticated: !!userData?.me,
    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    logout,
    createProfile: createProfileMutation.mutateAsync,
    updateProfile: updateProfileMutation.mutateAsync,
    deleteProfile: deleteProfileMutation.mutateAsync,
  };
}