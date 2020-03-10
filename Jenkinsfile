pipeline {
    agent any

    tools {
        nodejs "latest"
    }

    environment {
        RELEASE_VERSION= sh( returnStdout: true,
            script: "awk -v RS='' '/#/ {print; exit}' RELEASE.md | head -1 | sed 's/#//' | sed 's/ //'"
        )
        PACKAGE_VERSION = sh( returnStdout: true,
            script : "awk -F'\"' '/\"version\": \".+\"/{ print \$4; exit; }' package.json"
        )
    }

    stages{
        stage('NPM Master deployment'){
            when{
                branch 'master'
            }

            environment {
                NPM_CONFIG_ID = 'npm-jenkins-config'
            }

            steps {
                echo 'Prepare to deploy on npm'
                script {
                    checkVersion(PACKAGE_VERSION, RELEASE_VERSION)

                    nodejs(nodeJSInstallationName: 'latest', configId: NPM_CONFIG_ID) {
                        sh 'npm publish'
                    }
                }
                echo 'Deploy done'
            }
        }// end branch master

        stage('Verdaccio Next publish'){
            when{
                branch 'next'
            }

            environment {
                NPM_CONFIG_ID = 'verdaccio-jenkins-config'
            }

            steps {
                echo 'Prepare to deploy on verdaccio'
                script {
                    nodejs(nodeJSInstallationName: 'latest', configId: NPM_CONFIG_ID) {
                        sh 'npm publish'
                    }
                }
                echo 'Deploy unstable done'
            }
        }// end branch next
    }// end stages
}

void checkVersion(package_version, release_version){
    echo "Release VERSION : ${release_version}"
    echo "Package VERSION : ${package_version}"

    if(package_version != release_version){
        error 'RELEASE.md and package.json version don\'t match'
    }
    echo "VERSION OK"
}