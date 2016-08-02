import threading

from django.core.mail import send_mail


class EmailThread(threading.Thread):
    """
    Thread processing for asynchronous email sending for user registration
    """
    def __init__(self, subject, html_content, from_email, recipient_list):
        self.subject = subject
        self.html_content = html_content
        self.from_email = from_email
        self.recipient_list = recipient_list
        threading.Thread.__init__(self)

    def run(self):
        send_mail(self.subject, self.html_content, self.from_email, self.recipient_list, html_message=self.html_content)