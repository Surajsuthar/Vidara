import type * as React from "react";
import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

function SvgWrapper({
  title,
  children,
  ...props
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      {...props}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export const Icons = {
  GoogleLogo: ({ title = "Google Logo", ...props }: IconProps) => (
    <SvgWrapper viewBox="0 0 24 24" title={title} {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-2.86 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </SvgWrapper>
  ),
  Github: ({ title = "GitHub Logo", ...props }: IconProps) => (
    <SvgWrapper
      viewBox="0 0 24 24"
      fill="currentColor"
      title={title}
      {...props}
    >
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2" />
    </SvgWrapper>
  ),
  Twitter: ({ title = "Twitter Logo", ...props }: IconProps) => (
    <SvgWrapper
      viewBox="0 0 448 512"
      fill="currentColor"
      title={title}
      {...props}
    >
      <path d="M64 32C28.7 32 0 60.7 0 96v320c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64zm297.1 84L257.3 234.6L379.4 396h-95.6L209 298.1L123.3 396H75.8l111-126.9L69.7 116h98l67.7 89.5l78.2-89.5zm-37.8 251.6L153.4 142.9h-28.3l171.8 224.7h26.3z" />
    </SvgWrapper>
  ),
  Heart: ({ title = "Heart", ...props }: IconProps) => (
    <SvgWrapper
      viewBox="0 0 24 24"
      fill="currentColor"
      title={title}
      {...props}
    >
      <path d="M11.645 20.91l-.345-.314C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-9.3 12.1l-.355.31z" />
    </SvgWrapper>
  ),
  Falai: ({ title = "Fal AI Logo", ...props }: IconProps) => (
    <SvgWrapper
      viewBox="0 0 512 512"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit={2}
      title={title}
      {...props}
    >
      <g transform="scale(32)">
        <path
          d="M10.318 0c.277 0 .5.225.525.501A5.199 5.199 0 0015.5 5.157c.275.027.501.249.501.526v4.634a.542.542 0 01-.501.526 5.199 5.199 0 00-4.657 4.656.542.542 0 01-.525.501H5.683a.542.542 0 01-.526-.501 5.2 5.2 0 00-4.656-4.656.542.542 0 01-.501-.526V5.683c0-.277.225-.499.501-.526A5.2 5.2 0 005.157.501.543.543 0 015.684 0h4.634z"
          fill="currentColor"
        />
      </g>
    </SvgWrapper>
  ),
  ReplicateAi: ({ title = "Replicate Logo", ...props }: IconProps) => (
    <SvgWrapper
      viewBox="0 0 1000 1000"
      fill="currentColor"
      title={title}
      {...props}
    >
      <g>
        <polygon points="1000,427.6 1000,540.6 603.4,540.6 603.4,1000 477,1000 477,427.6" />
        <polygon points="1000,213.8 1000,327 364.8,327 364.8,1000 238.4,1000 238.4,213.8" />
        <polygon points="1000,0 1000,113.2 126.4,113.2 126.4,1000 0,1000 0,0" />
      </g>
    </SvgWrapper>
  ),
  Openai: ({ title = "OpenAI Logo", ...props }: IconProps) => (
    <SvgWrapper
      viewBox="0 0 16 16"
      fill="currentColor"
      title={title}
      {...props}
    >
      <path d="M14.949 6.547a3.94 3.94 0 0 0-.348-3.273 4.11 4.11 0 0 0-4.4-1.934A4.1 4.1 0 0 0 8.423.2 4.15 4.15 0 0 0 6.305.086a4.1 4.1 0 0 0-1.891.948 4.04 4.04 0 0 0-1.158 1.753 4.1 4.1 0 0 0-1.563.679A4 4 0 0 0 .554 4.72a3.99 3.99 0 0 0 .502 4.731 3.94 3.94 0 0 0 .346 3.274 4.11 4.11 0 0 0 4.402 1.933c.382.425.852.764 1.377.995.526.231 1.095.35 1.67.346 1.78.002 3.358-1.132 3.901-2.804a4.1 4.1 0 0 0 1.563-.68 4 4 0 0 0 1.14-1.253 3.99 3.99 0 0 0-.506-4.716m-6.097 8.406a3.05 3.05 0 0 1-1.945-.694l.096-.054 3.23-1.838a.53.53 0 0 0 .265-.455v-4.49l1.366.778q.02.011.025.035v3.722c-.003 1.653-1.361 2.992-3.037 2.996m-6.53-2.75a2.95 2.95 0 0 1-.36-2.01l.095.057L5.29 12.09a.53.53 0 0 0 .527 0l3.949-2.246v1.555a.05.05 0 0 1-.022.041L6.473 13.3c-1.454.826-3.311.335-4.15-1.098m-.85-6.94A3.02 3.02 0 0 1 3.07 3.949v3.785a.51.51 0 0 0 .262.451l3.93 2.237-1.366.779a.05.05 0 0 1-.048 0L2.585 9.342a2.98 2.98 0 0 1-1.113-4.094zm11.216 2.571L8.747 5.576l1.362-.776a.05.05 0 0 1 .048 0l3.265 1.86a3 3 0 0 1 1.173 1.207 2.96 2.96 0 0 1-.27 3.2 3.05 3.05 0 0 1-1.36.997V8.279a.52.52 0 0 0-.276-.445m1.36-2.015-.097-.057-3.226-1.855a.53.53 0 0 0-.53 0L6.249 6.153V4.598a.04.04 0 0 1 .019-.04L9.533 2.7a3.07 3.07 0 0 1 3.257.139c.474.325.843.778 1.066 1.303.223.526.289 1.103.191 1.664zM5.503 8.575 4.139 7.8a.05.05 0 0 1-.026-.037V4.049c0-.57.166-1.127.476-1.607s.752-.864 1.275-1.105a3.08 3.08 0 0 1 3.234.41l-.096.054-3.23 1.838a.53.53 0 0 0-.265.455zm.742-1.577 1.758-1 1.762 1v2l-1.755 1-1.762-1z" />
    </SvgWrapper>
  ),
  xAi: ({ title = "xAI Logo", ...props }: IconProps) => (
    <SvgWrapper
      viewBox="0 0 24 24"
      fill="currentColor"
      title={title}
      {...props}
    >
      <path d="M3 3h4.5l4.5 6.5L16.5 3H21l-7 9.5L21 21h-4.5L12 14.5 7.5 21H3l7-8.5Z" />
    </SvgWrapper>
  ),
  DeepInfra: ({ title = "DeepInfra Logo", ...props }: IconProps) => (
    <SvgWrapper
      viewBox="0 0 24 24"
      fill="currentColor"
      title={title}
      {...props}
    >
      {/* Three stacked bars, each shorter and offset left — the DeepInfra pyramid mark */}
      <rect x="4" y="4" width="16" height="4" rx="1" />
      <rect x="4" y="10" width="11" height="4" rx="1" />
      <rect x="4" y="16" width="6" height="4" rx="1" />
    </SvgWrapper>
  ),
};
