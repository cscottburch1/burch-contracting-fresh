import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'header' | 'footer' | 'invoice';
  className?: string;
  href?: string;
}

export function Logo({ variant = 'header', className = '', href = '/' }: LogoProps) {
  const sizes = {
    header: { width: 180, height: 60 },
    footer: { width: 150, height: 50 },
    invoice: { width: 200, height: 67 },
  };

  const size = sizes[variant];

  const logoImage = (
    <Image
      src="/logo.png"
      alt="Burch Contracting Logo"
      width={size.width}
      height={size.height}
      className={className}
      priority={variant === 'header'}
    />
  );

  if (variant === 'invoice') {
    return logoImage;
  }

  return (
    <Link href={href} className="block">
      {logoImage}
    </Link>
  );
}
