# Remove existing node_modules and package-lock.json
Write-Host "Cleaning up existing dependencies..."
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json }

# Install dependencies
Write-Host "Installing dependencies..."
npm install

# Install additional dependencies for development
Write-Host "Installing development dependencies..."
npm install -D @storybook/addon-a11y @storybook/addon-docs @storybook/addon-viewport

# Remove Material-UI dependencies if they exist
Write-Host "Removing Material-UI dependencies..."
npm uninstall @mui/material @mui/icons-material @emotion/react @emotion/styled

# Install Tailwind CSS and its dependencies
Write-Host "Setting up Tailwind CSS..."
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

Write-Host "Setup complete! You can now run:"
Write-Host "npm run dev - to start the development server"
Write-Host "npm run storybook - to start Storybook"
# Development environment setup script

Write-Host "🚀 Setting up development environment..."

# Navigate to the rent-portal directory
Set-Location -Path $PSScriptRoot/..

# Install dependencies
Write-Host "📦 Installing dependencies..."
npm install

# Set up AI tools environment
Write-Host "🤖 Setting up AI tools..."
Set-Location -Path ../ai-tools
python -m venv venv
./venv/Scripts/Activate.ps1
pip install -r requirements.txt

Write-Host "✅ Development environment setup complete!"
Write-Host "Run 'npm run dev' to start the development server."
