import { useEffect, useRef, useCallback } from "react";

const GoogleSignInButton = ({ onSuccess, onError, disabled = false, text = "continue_with" }) => {
  const buttonRef = useRef(null);
  const isInitialized = useRef(false);
  
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  const handleCredentialResponse = useCallback((response) => {
    if (response.credential) {
      onSuccessRef.current(response.credential);
    } else {
      onErrorRef.current?.("Google sign-in failed — no credential received");
    }
  }, []);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("VITE_GOOGLE_CLIENT_ID is not set");
      return;
    }

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id || isInitialized.current) return;

      // Track globally to avoid the 'called multiple times' error
      if (window._gsi_initialized_id === clientId) {
        isInitialized.current = true;
        renderButton();
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window._gsi_initialized_id = clientId;
        isInitialized.current = true;
        renderButton();
      } catch (error) {
        console.error("Google Sign-In initialization error:", error);
      }
    };

    const renderButton = () => {
      if (buttonRef.current && window.google?.accounts?.id) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: text,
          shape: "pill",
          width: buttonRef.current.offsetWidth || 380,
          logo_alignment: "left",
        });
      }
    };

    // Try immediately
    initializeGoogle();

    // Also wait for the script to load if it hasn't yet
    if (!isInitialized.current) {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initializeGoogle();
          clearInterval(interval);
        }
      }, 100);

      // Cleanup after 10 seconds
      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, 10000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [handleCredentialResponse, text]);

  return (
    <div
      ref={buttonRef}
      className={`w-full flex justify-center ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      style={{ minHeight: "44px" }}
    />
  );
};

export default GoogleSignInButton;
