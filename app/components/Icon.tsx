'use client';

type TgIconProps = {
  src: string;
  size?: number;
  className?: string;
  colorVar?: string;
};

export default function TgIcon({ src, size = 28, colorVar = "icon-color", className = "" }: TgIconProps) {
 return (
  <div
   className={className}
   style={{
    width: size,
    height: size,
    display: "inline-block",
    flexShrink: 0,
    backgroundColor: `var(${colorVar})`,
    maskImage: `url(${src})`,
    maskSize: 'contain',
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
    transition: 'background-color 0.2 ease-in-out',
   }}
  />
 )
}