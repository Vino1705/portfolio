Drop the résumé PDF in this folder, named exactly:

    vinothini-t-resume.pdf

That filename is what /resume.html links to (see client/src/data/resume.js,
PDF_PATH). Rename the constant there if you prefer a different filename.

Anything in client/public/ is copied to the site root at build time, so this
file ends up at https://<site>/resume/vinothini-t-resume.pdf
