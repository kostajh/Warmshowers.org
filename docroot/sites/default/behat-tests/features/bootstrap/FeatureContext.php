<?php
use Behat\Behat\Context\ClosuredContextInterface,
    Behat\Behat\Context\TranslatedContextInterface,
    Behat\Behat\Context\BehatContext,
    Behat\Behat\Exception\PendingException;
use Behat\Gherkin\Node\PyStringNode,
    Behat\Gherkin\Node\TableNode;

/**
 * Features context.
 */
class FeatureContext extends Drupal\DrupalExtension\Context\DrupalContext
{
    /**
     * Initializes context.
     * Every scenario gets its own context object.
     *
     * @param array $parameters context parameters (set them up through behat.yml)
     */
    public function __construct(array $parameters)
    {
        // Initialize your context here
    }

    /**
     * @Given /^I log out and log back in$/
     */
    public function iLogOutAndLogBackIn()
    {
        $this->getSession()->visit($this->locatePath('/logout'));
        $this->login();
    }

    /**
     * Take screenshot when step fails.
     * Works only with Selenium2Driver.
     *
     * @AfterStep
     */
    public function takeScreenshotAfterFailedStep($event)
    {
        if (4 === $event->getResult()) {
            $driver = $this->getSession()->getDriver();
            if (!($driver instanceof Selenium2Driver)) {
                //throw new UnsupportedDriverActionException('Taking screenshots is not supported by %s, use Selenium2Driver instead.', $driver);
                return;
            }
            $step = $event->getStep();
            $stepLine = $step->getLine();
            $fileName = '/tmp/stepAtLine' . $stepLine . '.png';
            $screenshot = $driver->getWebDriverSession()->screenshot();
            file_put_contents($fileName, base64_decode($screenshot));
            echo "Saved Screenshot To $fileName \n";
            $fileName = '/tmp/stepAtLine' . $stepLine .'.html';
            $source = $driver->getWebDriverSession()->source();
            file_put_contents($fileName, $source);
            echo "Saved Source To $fileName\n";
        }
    }

    /**
    * @Given /^I am on the homepage$/
    */
    public function iAmOnTheHomepage() {
       $this->getSession()->visit($this->locatePath('/'));
    }

    /**
     * @Given /^I wait (\d+) seconds$/
     */
    public function iWaitSeconds($arg1)
    {
        $seconds = (int)$arg1 * 1000;
        $this->getSession()->wait($seconds);
    }

    protected function jqueryWait($duration = 1000)
    {
        $this->getSession()->wait($duration, '(0 === jQuery.active && 0 === jQuery(\':animated\').length)');
    }

    /**
     * @Then /^I should see the form field "([^"]*)"$/
     */
    public function iShouldSeeTheFormField($title)
    {
        $this->jqueryWait(20000);
        $field = $this->getSession()->getPage()->findAll('css', $title);
        print_r($field);
    }

    /**
     * Private function for the whoami step.
     */
    private function whoami() {
        $element = $this->getSession()->getPage();
        // Go to the user page.
        $this->getSession()->visit($this->locatePath('/user'));
        if ($find = $element->find('css', '.username')) {
          $username = $find->getText();
          if ($username) {
            return $username;
          }
        }
        return FALSE;
    }

}
?>
