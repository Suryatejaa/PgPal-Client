const AuthLayout = ({ children, app_type }: { children: React.ReactNode, app_type: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-400 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Purple PG for {app_type === "tenant" ? "Tenants" : "Owners"}
        </h1>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
