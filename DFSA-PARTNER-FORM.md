# Partner with the DFSA — collecting submissions in Google Drive

The expression-of-interest form in `DFSA.html` (`#partner`) posts to a **Google Form**,
which writes every submission to a **Google Sheet** in Drive. The visitor never sees
Google: the page posts in the background and shows its own "Thank you" panel.

The form is **live**. `GFORM.FORM_ID` and the seven `entry.*` ids are wired into
`DFSA.html`. If a request ever fails (offline, endpoint blocked) the handler falls
back to `mailto:DSL-IP@fao.org`, so a submission is never silently lost.

## Live configuration

Form: `1FAIpQLSfB7oyEJmndBZd9XyoxfGk4mRHdciAReuQsshHiQ8JahnjJJw`

| Page field     | Google question               | Entry id             |
|----------------|-------------------------------|----------------------|
| `name`         | Full name                     | `entry.575034493`    |
| `email`        | Email                         | `entry.27342489`     |
| `organisation` | Organisation                  | `entry.826833287`    |
| `country`      | Country / region              | `entry.1362536633`   |
| `partnerType`  | I am reaching out as a        | `entry.69474079`     |
| `interest`     | Area of interest              | `entry.228082095`    |
| `message`      | How would you like to engage? | `entry.1626428202`   |

## How it was set up (for reference / rebuilding)

1. Create a Google Form (forms.new) titled e.g. *DFSA — Expression of interest*.
2. Add these questions, **in this order and of these types**:

   | # | Question                  | Type            | Required |
   |---|---------------------------|-----------------|----------|
   | 1 | Full name                 | Short answer    | yes      |
   | 2 | Email                     | Short answer    | yes      |
   | 3 | Organisation              | Short answer    | yes      |
   | 4 | Country / region          | Short answer    | no       |
   | 5 | I am reaching out as a    | Short answer    | yes      |
   | 6 | Area of interest          | Short answer    | no       |
   | 7 | How would you like to engage? | Paragraph   | no       |

   Use **Short answer** for 5 and 6, not multiple-choice. The page already
   constrains the options in its own `<select>`, and a Google multiple-choice
   question rejects any value it doesn't recognise — which would silently drop
   submissions if the two option lists ever drift apart.

3. In *Responses*, click the Sheets icon to create the linked spreadsheet.
   That sheet is the collection point in Drive.
4. Get the ids:
   - **Form id** — open the live form (*Send* → link). The URL is
     `https://docs.google.com/forms/d/e/<FORM_ID>/viewform`. Copy `<FORM_ID>`
     (it starts `1FAIpQLS…`).
   - **Field ids** — on the live form, *view source* and search for `entry.`.
     Each question has one `entry.XXXXXXXXX`, in the order above.
5. Paste them into the `GFORM` object in `DFSA.html`.

## Why `mode: 'no-cors'`

Google Forms returns no CORS headers, so the browser gives us an *opaque* response:
the POST is delivered and recorded, but the page **cannot read whether it succeeded**.
The handler therefore shows "Thank you" optimistically. A genuine network failure
(offline, endpoint blocked) rejects the `fetch` and falls back to `mailto`, so a
submission is never silently lost.

If you ever need a true success/failure signal — or an email alert per submission —
swap the Google Form for an Apps Script web app bound to the sheet; that can return
real JSON and call `MailApp`.

## Note on personal data

The form collects names, emails and organisations. Submissions land in a Google
Sheet owned by whoever creates the form. For an FAO-facing platform, confirm that
this is an acceptable location for personal data, and that the form's privacy
notice matches FAO policy, before publicising the page.
