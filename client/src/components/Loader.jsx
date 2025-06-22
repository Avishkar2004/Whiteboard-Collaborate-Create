import { motion as Motion } from 'framer-motion';

const Loader = ({
    size = 'md',
    variant = 'spinner',
    color = 'indigo',
    text = '',
    fullScreen = false,
    className = ''
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12'
    };

    const colorClasses = {
        indigo: 'border-indigo-600',
        blue: 'border-blue-600',
        green: 'border-green-600',
        red: 'border-red-600',
        yellow: 'border-yellow-600',
        gray: 'border-gray-600',
        white: 'border-white'
    };

    const textColorClasses = {
        indigo: 'text-indigo-600',
        blue: 'text-blue-600',
        green: 'text-green-600',
        red: 'text-red-600',
        yellow: 'text-yellow-600',
        gray: 'text-gray-600',
        white: 'text-white'
    };

    const SpinnerLoader = () => (
        <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-2 ${sizeClasses[size]} ${colorClasses[color]}`} />
    );

    const DotsLoader = () => (
        <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
                <Motion.div
                    key={i}
                    className={`${sizeClasses[size]} rounded-full ${colorClasses[color].replace('border-', 'bg-')}`}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                    }}
                />
            ))}
        </div>
    );

    const PulseLoader = () => (
        <Motion.div
            className={`${sizeClasses[size]} rounded-full ${colorClasses[color].replace('border-', 'bg-')}`}
            animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    );

    const RingLoader = () => (
        <div className="relative">
            <div className={`${sizeClasses[size]} rounded-full border-2 border-gray-200`} />
            <Motion.div
                className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-2 border-transparent border-t-2 ${colorClasses[color]}`}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
        </div>
    );

    const WaveLoader = () => (
        <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((i) => (
                <Motion.div
                    key={i}
                    className={`w-1 ${colorClasses[color].replace('border-', 'bg-')}`}
                    style={{ height: size === 'sm' ? '12px' : size === 'md' ? '16px' : size === 'lg' ? '20px' : '24px' }}
                    animate={{
                        height: [
                            size === 'sm' ? '12px' : size === 'md' ? '16px' : size === 'lg' ? '20px' : '24px',
                            size === 'sm' ? '20px' : size === 'md' ? '24px' : size === 'lg' ? '28px' : '32px',
                            size === 'sm' ? '12px' : size === 'md' ? '16px' : size === 'lg' ? '20px' : '24px'
                        ]
                    }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.1
                    }}
                />
            ))}
        </div>
    );

    const getLoaderComponent = () => {
        switch (variant) {
            case 'dots':
                return <DotsLoader />;
            case 'pulse':
                return <PulseLoader />;
            case 'ring':
                return <RingLoader />;
            case 'wave':
                return <WaveLoader />;
            default:
                return <SpinnerLoader />;
        }
    };

    const LoaderContent = () => (
        <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
            {getLoaderComponent()}
            {text && (
                <p className={`text-sm font-medium ${textColorClasses[color]}`}>
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
                <LoaderContent />
            </div>
        );
    }

    return <LoaderContent />;
};

// Specific loader variants for common use cases
export const PageLoader = ({ text = 'Loading...' }) => (
    <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" text={text} />
    </div>
);

export const CardLoader = ({ text = 'Loading...' }) => (
    <div className="flex items-center justify-center p-8">
        <Loader size="md" text={text} />
    </div>
);

export const ButtonLoader = ({ text = 'Loading...' }) => (
    <div className="flex items-center justify-center">
        <Loader size="sm" text={text} />
    </div>
);

export const InlineLoader = ({ text = 'Loading...' }) => (
    <div className="flex items-center justify-center py-4">
        <Loader size="sm" text={text} />
    </div>
);

export default Loader; 