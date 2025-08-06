# 🚀 CareerHub Setup Guide

Follow these steps to get your CareerHub application up and running!

## Step 1: Set Up Supabase (Backend)

### 1.1 Create a Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and sign up with GitHub or email
3. Verify your email if needed

### 1.2 Create a New Project
1. Click "New Project"
2. Choose your organization (or create one)
3. Fill in project details:
   - **Name**: CareerHub (or any name you prefer)
   - **Database Password**: Create a secure password (save it!)
   - **Region**: Choose the closest region to you
4. Click "Create new project"
5. Wait for the project to be created (takes ~2 minutes)

### 1.3 Set Up the Database
1. In your Supabase dashboard, go to the **SQL Editor** (left sidebar)
2. Open the `database.sql` file in this project
3. Copy ALL the SQL code from the file
4. Paste it into the SQL Editor
5. Click **Run** to execute the SQL
6. You should see "Success. No rows returned" - this is normal!

### 1.4 Get Your API Keys
1. Go to **Settings** > **API** (left sidebar)
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 2: Set Up the React Application

### 2.1 Create Environment Variables
1. In the project root (`my-react-app` folder), create a file named `.env`
2. Add the following content, replacing with your actual values:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 2.2 Install Dependencies
Open terminal in the `my-react-app` folder and run:
```bash
npm install
```

### 2.3 Start the Development Server
```bash
npm run dev
```

The app should open at `http://localhost:5173`

## Step 3: Test the Application

### 3.1 Verify Database Connection
1. Open the app in your browser
2. You should see the CareerHub homepage with sample posts
3. Try searching for "internship" in the search box
4. Try sorting by "Most Upvoted"

### 3.2 Test Creating a Post
1. Click "Share Experience" in the navigation
2. Fill out the form with test data
3. Click "Share Experience"
4. You should be redirected to the homepage and see your new post

### 3.3 Test Post Interactions
1. Click on any post to view details
2. Try upvoting the post
3. Add a comment
4. Try editing and deleting posts

## 🎉 You're Done!

Your CareerHub application is now fully functional! Here's what you can do next:

### Customize the App
- Change the colors in `src/App.css`
- Update the app name and description
- Add your own categories
- Modify the sample data

### Deploy Your App
- **Vercel**: Connect your GitHub repo to Vercel
- **Netlify**: Drag and drop the `dist` folder after running `npm run build`
- Don't forget to add your environment variables in your deployment platform!

## 🆘 Troubleshooting

### Common Issues

**"Failed to load posts"**
- Check that your `.env` file has the correct Supabase URL and key
- Ensure you ran the `database.sql` script in Supabase
- Check browser console for specific error messages

**"Module not found" errors**
- Run `npm install` again
- Delete `node_modules` folder and `package-lock.json`, then run `npm install`

**Styling looks broken**
- Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Check if `src/App.css` was properly created

**Database connection issues**
- Verify your Supabase project is active
- Check that RLS policies were created (they should allow public access)
- Ensure your API key is the "anon public" key, not the "service role" key

### Getting Help
- Check the browser console for error messages
- Compare your `.env` file with the format shown above
- Verify your Supabase project settings
- Create an issue on GitHub if you're still stuck

## 🎯 Next Steps

Ready to extend your app? Here are some ideas:
- Add user authentication
- Create user profiles
- Add image upload functionality
- Implement real-time updates
- Add email notifications
- Create a mobile app version

Happy coding! 🚀 