import shrek from '../assets/shrek.png';

export function Home() {
    const token = localStorage.getItem('token');
    console.log("token home: ", token)

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-screen-lg p-4">
                <img 
                    src={shrek} 
                    alt="Shrek" 
                    className="w-full h-auto object-contain rounded-lg shadow-lg"
                />
            </div>
        </div>
    )
}