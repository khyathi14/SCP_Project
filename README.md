# 💰 Personal Finance Tracker

A comprehensive web application for managing personal finances with income/expense tracking, real-time currency conversion, email notifications, and data visualization.

## 🚀 Features

- **Transaction Management**: Add, edit, delete income and expense transactions
- **Real-time Statistics**: Track total income, expenses, balance, and transaction count
- **Data Visualization**: Interactive charts showing expense breakdown and monthly trends
- **Currency Converter**: Integrated real-time currency conversion (via AWS Lambda)
- **Email Notifications**: Get notified via AWS SNS when transactions are added
- **Filtering & Search**: Filter transactions by type, category, and date range
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🏗️ Architecture & AWS Services

This application integrates multiple AWS services:

- **AWS Lambda**: Serverless currency conversion API
- **API Gateway**: HTTP API endpoints for Lambda functions
- **SNS (Simple Notification Service)**: Email notifications for new transactions
- **Elastic Beanstalk**: Application hosting (Node.js)
- **MongoDB Atlas**: Database for transaction storage
- **CloudWatch**: Monitoring and logging

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)
- AWS Account (for Lambda, SNS, API Gateway)
- Git

## 🔧 Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd SCP_Project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/financeDB

# Server Configuration
PORT=3000
NODE_ENV=development

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# SNS Topic ARN
SNS_TOPIC_ARN=arn:aws:sns:us-east-1:account-id:FinanceTrackerNotifications
```

### 4. Start the Application

```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
SCP_Project/
├── models/
│   ├── transaction.js      # Transaction schema (MongoDB)
│   └── conversion.js        # Old conversion schema (can be removed)
├── lambda/
│   ├── lambda-currency.js   # Currency converter Lambda function
│   ├── lambda-quotes.js     # Finance quotes Lambda (optional)
│   └── lambda-visualization.js  # Data visualization Lambda (optional)
├── MyApi/
│   └── lambda-currency.js   # Original currency Lambda function
├── public/
│   └── index.html          # Frontend application
├── server.js               # Express.js server
├── package.json            # Dependencies
├── .env.example            # Environment variables template
├── DEPLOYMENT.md           # AWS deployment guide
└── README.md               # This file
```

## 🎯 API Endpoints

### Transaction Endpoints

- `GET /api/transactions` - Get all transactions (supports filters)
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Statistics Endpoints

- `GET /api/stats/summary` - Get summary statistics
- `GET /api/stats/monthly` - Get monthly trends

### SNS Endpoints

- `POST /api/sns/subscribe` - Subscribe email to notifications

### Query Parameters (Filters)

```
GET /api/transactions?type=expense&category=Food&startDate=2026-01-01&endDate=2026-02-19
```

## 🌐 AWS Lambda Functions

### Currency Converter API

**Function**: `CurrencyConverterAPI`
**Endpoints**:
- `GET /convert?from=USD&to=EUR&amount=100`
- `GET /currencies`

**Example**:
```bash
curl "https://your-api.execute-api.us-east-1.amazonaws.com/prod/convert?from=USD&to=EUR&amount=100"
```

## 📧 SNS Email Notifications

When a new transaction is added, an email notification is sent to all subscribed users containing:
- Transaction type (income/expense)
- Amount and currency
- Category
- Description
- Date

## 🎨 Frontend Features

- **Dashboard**: Summary cards showing key metrics
- **Charts**: 
  - Pie chart for expense breakdown by category
  - Bar chart for monthly income vs expenses
- **Transaction Form**: Add/edit transactions with validation
- **Currency Converter**: Quick currency conversion widget
- **Email Subscription**: Subscribe to transaction notifications
- **Filters**: Filter transactions by type and category

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions including:
- MongoDB Atlas setup
- AWS SNS configuration
- Lambda function deployment
- API Gateway setup
- Elastic Beanstalk deployment

## 🧪 Testing

### Test Locally

1. Start the server: `npm start`
2. Open browser: `http://localhost:3000`
3. Add a transaction and verify it's saved
4. Check MongoDB Atlas to see the data

### Test AWS Services

1. **Lambda**: Test in AWS Console or via curl
2. **SNS**: Subscribe an email and add a transaction
3. **API Gateway**: Test endpoints via Postman or curl

## 🔒 Security Notes

- Never commit `.env` file to Git
- Use environment variables for all sensitive data
- Enable HTTPS in production
- Implement rate limiting for API endpoints
- Validate all user inputs
- Use AWS IAM roles with minimal permissions

## 📝 To-Do / Future Enhancements

- [ ] Add user authentication (AWS Cognito)
- [ ] Implement budgeting features
- [ ] Add recurring transactions
- [ ] Export data to CSV/PDF
- [ ] Multi-currency portfolio management
- [ ] Mobile app (React Native)
- [ ] Integration with bank APIs
- [ ] AI-powered expense categorization

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### SNS Not Sending Emails
- Confirm subscription is confirmed via email
- Check IAM permissions for SNS
- Verify Topic ARN in `.env`

### Lambda API Errors
- Check Lambda logs in CloudWatch
- Verify API Gateway configuration
- Test Lambda function directly

## 📚 Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Frontend**: HTML, CSS (Tailwind CSS), JavaScript
- **Charts**: Chart.js
- **AWS Services**: Lambda, API Gateway, SNS, Elastic Beanstalk, CloudWatch
- **Other**: AWS SDK for JavaScript

## 👨‍💻 Development

```bash
# Install dependencies
npm install

# Run in development mode (with nodemon)
npm run dev

# Run in production mode
npm start
```

## 📄 License

This project is for educational purposes (Scalable Cloud Programming course).

## 🤝 Contributing

This is a course project, but suggestions are welcome!

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for SCP Project - Semester 2, 2025/26**