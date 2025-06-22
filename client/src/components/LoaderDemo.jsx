import { useState } from 'react';
import Loader, { PageLoader, CardLoader, ButtonLoader, InlineLoader } from './Loader';

const LoaderDemo = () => {
  const [showFullScreen, setShowFullScreen] = useState(false);

  const variants = ['spinner', 'dots', 'pulse', 'ring', 'wave'];
  const sizes = ['sm', 'md', 'lg', 'xl'];
  const colors = ['indigo', 'blue', 'green', 'red', 'yellow', 'gray'];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Loader Component Demo</h1>

        {/* Full Screen Loader Demo */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Full Screen Loader</h2>
          <button
            onClick={() => setShowFullScreen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Show Full Screen Loader
          </button>
          {showFullScreen && (
            <PageLoader text="Loading page..." />
          )}
        </div>

        {/* Variants Demo */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Loader Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {variants.map((variant) => (
              <div key={variant} className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4 capitalize">{variant}</h3>
                <div className="flex items-center justify-center">
                  <Loader variant={variant} size="lg" text={`${variant} loader`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sizes Demo */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Loader Sizes</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-center space-x-8">
              {sizes.map((size) => (
                <div key={size} className="text-center">
                  <Loader size={size} text={size} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colors Demo */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Loader Colors</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {colors.map((color) => (
                <div key={color} className="text-center">
                  <Loader size="md" color={color} text={color} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pre-built Components Demo */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pre-built Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Page Loader</h3>
              <div className="h-32 flex items-center justify-center">
                <PageLoader text="Loading page..." />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Card Loader</h3>
              <div className="h-32 flex items-center justify-center">
                <CardLoader text="Loading content..." />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Button Loader</h3>
              <div className="h-32 flex items-center justify-center">
                <ButtonLoader text="Loading..." />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Inline Loader</h3>
              <div className="h-32 flex items-center justify-center">
                <InlineLoader text="Loading..." />
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Usage Examples</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Code Examples</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Basic Usage:</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`<Loader size="md" variant="spinner" text="Loading..." />`}
                </pre>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Pre-built Components:</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`import { PageLoader, CardLoader, ButtonLoader, InlineLoader } from './Loader';

<PageLoader text="Loading page..." />
<CardLoader text="Loading content..." />
<ButtonLoader text="Loading..." />
<InlineLoader text="Loading..." />`}
                </pre>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Full Screen Overlay:</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`<Loader fullScreen={true} text="Loading..." />`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Props Reference */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Props Reference</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Prop</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Default</th>
                  <th className="text-left py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-mono">size</td>
                  <td className="py-2">'sm' | 'md' | 'lg' | 'xl'</td>
                  <td className="py-2">'md'</td>
                  <td className="py-2">Size of the loader</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">variant</td>
                  <td className="py-2">'spinner' | 'dots' | 'pulse' | 'ring' | 'wave'</td>
                  <td className="py-2">'spinner'</td>
                  <td className="py-2">Animation style</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">color</td>
                  <td className="py-2">'indigo' | 'blue' | 'green' | 'red' | 'yellow' | 'gray' | 'white'</td>
                  <td className="py-2">'indigo'</td>
                  <td className="py-2">Color theme</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">text</td>
                  <td className="py-2">string</td>
                  <td className="py-2">''</td>
                  <td className="py-2">Loading text</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">fullScreen</td>
                  <td className="py-2">boolean</td>
                  <td className="py-2">false</td>
                  <td className="py-2">Full screen overlay</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">className</td>
                  <td className="py-2">string</td>
                  <td className="py-2">''</td>
                  <td className="py-2">Additional CSS classes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoaderDemo; 