import toast, { Toaster } from 'react-hot-toast';

function App() {

  const handleClick = () => toast.success('Success')
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <button className="h-10 w-16 bg-green-700 hover:bg-green-600 active:bg-green-500 text-white rounded-[30px]" onClick={handleClick}>hi</button>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  )
}

export default App
