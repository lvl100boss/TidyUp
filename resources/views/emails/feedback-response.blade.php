<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Response to Your Feedback</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.5;
            color: #020617;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
            -webkit-text-size-adjust: none;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        .email-wrapper {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #f8fafc;
            padding: 20px;
        }

        .email-container {
            background-color: #ffffff;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .email-header {
            background-color: #09090b;
            padding: 30px 20px;
            text-align: center;
        }

        .logo {
            width: 120px;
            height: auto;
            margin-bottom: 15px;
        }

        .email-header h2 {
            color: #ffffff;
            margin: 0;
            font-weight: 600;
            font-size: 20px;
            letter-spacing: -0.015em;
        }

        .email-content {
            padding: 32px 24px;
        }

        .email-footer {
            background-color: #f1f5f9;
            padding: 16px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
        }

        .message-box {
            background-color: #f8fafc;
            padding: 16px;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            margin: 20px 0;
        }

        .response-box {
            background-color: #f8fafc;
            padding: 16px;
            border: 1px solid #e2e8f0;
            border-left: 3px solid #0f172a;
            border-radius: 4px;
            margin: 20px 0;
        }

        .box-title {
            color: #334155;
            margin-top: 0;
            margin-bottom: 12px;
            font-size: 15px;
            font-weight: 600;
        }

        .box-content {
            margin: 0;
            color: #475569;
            white-space: pre-line;
        }

        .greeting {
            font-size: 16px;
            font-weight: 500;
            color: #0f172a;
            margin-bottom: 16px;
        }

        .paragraph {
            margin: 0 0 16px;
            color: #334155;
        }

        .signature {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
        }

        .signature-text {
            margin: 0;
            color: #64748b;
        }

        .signature-name {
            font-weight: 600;
            color: #334155;
        }

        .subject {
            font-weight: 500;
        }

        .social-links {
            margin-top: 12px;
        }

        .social-link {
            display: inline-block;
            margin: 0 5px;
            color: #64748b;
            text-decoration: none;
        }

        .social-link:hover {
            color: #0f172a;
            text-decoration: underline;
        }

        .status-container {
            margin: 20px 0;
            padding: 12px 16px;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
        }

        .status-label {
            font-weight: 500;
            font-size: 14px;
            color: #334155;
            margin-bottom: 4px;
        }

        .highlight-status {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
            margin-top: 4px;
        }

        .status-pending {
            background-color: #fef9c3;
            color: #854d0e;
        }

        .status-in-progress {
            background-color: #e0f2fe;
            color: #0369a1;
        }

        .status-resolved {
            background-color: #dcfce7;
            color: #166534;
        }

        .status-closed {
            background-color: #f1f5f9;
            color: #475569;
        }

        .status-description {
            margin-top: 8px;
            font-size: 13px;
            color: #64748b;
        }

        @media only screen and (max-width: 600px) {
            .email-content {
                padding: 24px 16px;
            }
        }
    </style>
</head>

<body>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="email-header">
                <img src="{{ asset('assets/images/tidyUpLogoWhite.svg') }}" alt="TidyUp Logo" class="logo">
                <h2>Feedback Response</h2>
            </div>

            <div class="email-content">
                <p class="greeting">Hello {{ $name ?? 'there' }},</p>

                <p class="paragraph">Thank you for your feedback submitted on {{ \Carbon\Carbon::parse($created_at)->format('F j, Y') }} regarding "<span class="subject">{{ $subject }}</span>". We appreciate you taking the time to share your thoughts with us.</p>

                <div class="message-box">
                    <h4 class="box-title">Your Message</h4>
                    <p class="box-content">{!! nl2br(e($message)) !!}</p>
                </div>

                <div class="response-box">
                    <h4 class="box-title">Our Response</h4>
                    <p class="box-content">{!! nl2br(e($response)) !!}</p>
                </div>

                @if(isset($status) && !empty($status))
                <div class="status-container">
                    <div class="status-label">Current Status of Your Feedback:</div>
                    <span class="highlight-status status-{{ str_replace(' ', '-', strtolower($status)) }}">
                        {{ ucfirst($status) }}
                    </span>
                    <div class="status-description">
                        @if(strtolower($status) == 'pending')
                        Your feedback has been received and is waiting to be reviewed by our team.
                        @elseif(strtolower($status) == 'in-progress')
                        Our team is currently working on addressing your feedback.
                        @elseif(strtolower($status) == 'resolved')
                        We've completed our work on this feedback item. We hope our solution meets your needs.
                        @elseif(strtolower($status) == 'closed')
                        This feedback item has been closed. If you're not satisfied, please submit a new feedback.
                        @endif
                    </div>
                </div>
                @endif

                <p class="paragraph">If you have any further questions or additional feedback, please don't hesitate to reach out to us.</p>

                <div class="signature">
                    <p class="signature-text">
                        Best regards,<br>
                        <span class="signature-name">The TidyUp Team</span>
                    </p>
                </div>
            </div>

            <div class="email-footer">
                <p>© {{ date('Y') }} TidyUp. All rights reserved.</p>
                <div class="social-links">
                    <a href="#" class="social-link">Twitter</a> •
                    <a href="#" class="social-link">Instagram</a> •
                    <a href="#" class="social-link">LinkedIn</a>
                </div>
            </div>
        </div>
    </div>
</body>

</html>