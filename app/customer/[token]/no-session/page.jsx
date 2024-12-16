const NoSession = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <header className="bg-white shadow-custom p-4">
                <div className="container mx-auto">
                    <h1 className="text-xl font-bold">
                        <span className="block text-primary">Hinkali</span>
                        <span className="block text-secondary">Georgian</span>
                        <span className="block text-titleColour">Restaurant</span>
                    </h1>
                </div>
            </header>
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="text-center space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-800">Session Expired</h2>
                        <p className="text-gray-600">Your session has expired or is invalid.</p>
                    </div>
                    <p className="text-lg text-gray-700">
                        Please scan the QR code again to start a new session.
                    </p>
                    <div className="animate-bounce">
                        <i className="fas fa-qrcode text-4xl text-customYellow"></i>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default NoSession