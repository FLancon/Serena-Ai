import { createClient } from '@supabase/supabase-js'
import { ref, computed } from 'vue'
import { z } from 'zod'
import zxcvbn from 'zxcvbn'

const user = ref(null)
const loading = ref(false)
const error = ref(null)

// Email validation schema
const emailSchema = z.string().email('Email invalide')

// Password validation schema
const passwordSchema = z.string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
  .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial')

export const useAuth = () => {
  const config = useRuntimeConfig()
  const supabase = createClient(
    config.public.SUPABASE_URL,
    config.public.SUPABASE_KEY
  )

  // Check if user is authenticated
  const isAuthenticated = computed(() => !!user.value)

  // Initialize auth state
  const initAuth = async () => {
    try {
      loading.value = true
      const { data: { session } } = await supabase.auth.getSession()
      user.value = session?.user ?? null
      
      // Set up auth state change listener
      supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user ?? null
      })
    } catch (e) {
      console.error('Error initializing auth:', e)
      error.value = 'Erreur lors de l\'initialisation de l\'authentification'
    } finally {
      loading.value = false
    }
  }

  // Sign in with email
  const signIn = async (email: string, password: string) => {
    try {
      loading.value = true
      error.value = null

      // Validate email
      emailSchema.parse(email)

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError
      return data
    } catch (e) {
      console.error('Sign in error:', e)
      error.value = e.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect'
        : 'Erreur lors de la connexion'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      loading.value = true
      error.value = null

      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (signInError) throw signInError
      return data
    } catch (e) {
      console.error('Google sign in error:', e)
      error.value = 'Erreur lors de la connexion avec Google'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Sign up new user
  const signUp = async (email: string, password: string, confirmPassword: string) => {
    try {
      loading.value = true
      error.value = null

      // Validate email and password
      emailSchema.parse(email)
      passwordSchema.parse(password)

      // Check password confirmation
      if (password !== confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas')
      }

      // Check password strength
      const passwordStrength = zxcvbn(password)
      if (passwordStrength.score < 3) {
        throw new Error('Le mot de passe est trop faible')
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (signUpError) throw signUpError
      return data
    } catch (e) {
      console.error('Sign up error:', e)
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      loading.value = true
      error.value = null
      await supabase.auth.signOut()
    } catch (e) {
      console.error('Sign out error:', e)
      error.value = 'Erreur lors de la déconnexion'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      loading.value = true
      error.value = null

      emailSchema.parse(email)

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (resetError) throw resetError
    } catch (e) {
      console.error('Password reset error:', e)
      error.value = 'Erreur lors de la réinitialisation du mot de passe'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    initAuth,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword
  }
}