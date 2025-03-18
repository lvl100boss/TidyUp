<!DOCTYPE html>
<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style>
        .button {
            background-color: #4F46E5;
            color: #ffffff;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            display: inline-block;
            font-family: 'Figtree', sans-serif;
        }

        .heading {
            font-family: 'Figtree', sans-serif;
            font-size: 24px;
            font-weight: 500;
            color: #1a1a1a;
        }
    </style>
</head>

<body style="background: #f8f9fa; padding: 20px; font-family: 'Figtree', Arial, sans-serif; line-height: 1.5;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <tr>
            <td style="padding: 20px; text-align: center;">
                <img src="{{ asset('assets/images/tidyUpLogo.svg') }}" alt="{{ config('app.name') }}" style="height: 100px;">
            </td>
        </tr>
        <tr>
            <td style="padding: 30px;">
                @if (! empty($greeting))
                <h1 class="heading" style="text-align: center; margin-bottom: 20px;">{{ $greeting }}</h1>
                @endif

                @foreach ($introLines as $line)
                <p style="color: #4a5568; margin-bottom: 15px; text-align: center;">{{ $line }}</p>
                @endforeach

                @isset($actionText)
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                        <td style="text-align: center; padding: 30px 0;">
                            <a href="{{ $actionUrl }}" class="button">{{ $actionText }}</a>
                        </td>
                    </tr>
                </table>
                @endisset

                @foreach ($outroLines as $line)
                <p style="color: #4a5568; margin-bottom: 15px;">{{ $line }}</p>
                @endforeach

                @if (! empty($salutation))
                <p style="margin-top: 30px; color: #4a5568;">{{ $salutation }}</p>
                @else
                <p style="margin-top: 30px; color: #4a5568;">
                    @lang('Best regards,')
                    <br>
                    <strong>{{ config('app.name') }}</strong>
                </p>
                @endif

                @isset($actionText)
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="font-size: 13px; color: #718096;">
                        @lang(
                        "If you're having trouble clicking the \":actionText\" button, copy and paste the URL below\n".
                        'into your web browser:',
                        [
                        'actionText' => $actionText,
                        ]
                        )
                        <br>
                        <a href="{{ $actionUrl }}" style="color: #4F46E5; text-decoration: underline; word-break: break-all;">{{ $actionUrl }}</a>
                    </p>
                </div>
                @endisset
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; color: #718096; font-size: 12px;">
                    © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
                </p>
            </td>
        </tr>
    </table>
</body>

</html>