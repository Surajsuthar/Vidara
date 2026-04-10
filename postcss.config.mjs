const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
  theme: {
    extend: {
      animation: {
        shimmer: "shimmer 1.6s infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
      },
    },
  },
};

export default config;
