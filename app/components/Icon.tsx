'use client';

export default function TgIcon({ src = '', size = 28, className = '' }) {
 return (
  <div
   className={className}
   style={{
    width: size,
    height: size,
    maskImage: `url(${src})`,
    maskSize: 'contain',
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
   }}
  />
 )
}